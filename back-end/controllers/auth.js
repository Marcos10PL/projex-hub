import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  confirmEmailOptions,
  resetPasswordOptions,
  tokenOptions,
} from "../lib/variables.js";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const login = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password)
    throw new BadRequestError("Please provide login and password");

  const user = await User.findOne({
    $or: [{ email: login }, { username: login }],
  });

  if (!user) throw new UnauthenticatedError("Invalid login");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new UnauthenticatedError("Invalid password");

  const token = user.createJWT();

  res.cookie("token", token, tokenOptions);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "User logged in",
    user: {
      email: user.email,
      username: user.username,
      isActivated: user.isActivated,
    },
  });
};

const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    throw new BadRequestError("Please provide all fields");

  let existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError("Email already in use");

  existingUser = await User.findOne({ username });
  if (existingUser) throw new BadRequestError("Username already in use");

  if (!password.match(passwordRegex)) {
    throw new BadRequestError(
      "Password must be at least 8 characters long and contain an uppercase letter and a digit"
    );
  }

  const newUser = await User.create({ email, password, username });

  const emailToken = newUser.createEmailJWT();

  const emailOptions = {
    to: newUser.email,
    from: process.env.EMAIL,
    subject: confirmEmailOptions.subject,
    html: confirmEmailOptions.html(emailToken),
  };

  try {
    await sgMail.send(emailOptions);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "User created (not verified - email sent)" });
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Email could not be sent");
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({ success: true, msg: "User logged out" });
};

const checkAuth = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "User authenticated", user: req.user });
};

const confirmEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) throw new BadRequestError("Invalid token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) throw new NotFoundError("No user found");

    if (user.isActivated) throw new BadRequestError("Email already confirmed");

    user.isActivated = true;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, msg: "Email confirmed" });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      throw new BadRequestError("Invalid or malformed token");

    throw error;
  }
};

const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new BadRequestError("Please provide an email");

    const response = await sendConfirmationEmail(email);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Email could not be sent");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Please provide an email");

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError("No user found");

  if (!user.isActivated) throw new BadRequestError("Email not confirmed");

  user.isResetPassTokenExpired = false;
  await user.save();

  const token = user.createEmailJWT();

  const emailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: resetPasswordOptions.subject,
    html: resetPasswordOptions.html(token),
  };

  try {
    await sgMail.send(emailOptions);
    res.status(StatusCodes.OK).json({ success: true, msg: "Email sent" });
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Email could not be sent");
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password)
    throw new BadRequestError("Please provide all fields");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) throw new NotFoundError("No user found");

    if (!user.isActivated) throw new BadRequestError("Email not confirmed");

    if (user.isResetPassTokenExpired)
      throw new BadRequestError("Token already used");

    if (!password.match(passwordRegex)) {
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain an uppercase letter and a digit"
      );
    }

    user.password = password;
    user.isResetPassTokenExpired = true;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, msg: "Password reset" });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      throw new BadRequestError("Invalid or malformed token");

    throw error;
  }
};

const updateUser = async (req, res) => {
  const { email, username, newPassword, password } = req.body;

  if (!email && !username && !newPassword)
    throw new BadRequestError("Please at least provide one field to update");

  if (!password)
    throw new BadRequestError("Please provide your current password");

  const user = await User.findOne({ email: req.user.email });

  if (!user) throw new NotFoundError("No user found");

  if (!user.isActivated)
    throw new BadRequestError("Your email is not confirmed");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new UnauthenticatedError("Invalid password");

  let state = false;
  let isEmailChanged = false;

  if (email && email !== user.email) {
    user.email = email;
    user.isActivated = false;
    state = true;
    isEmailChanged = true;
  }

  if (username && username !== user.username) {
    user.username = username;
    state = true;
  }

  if (newPassword && !(await user.matchPassword(newPassword))) {
    if (!newPassword.match(passwordRegex)) {
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain an uppercase letter and a digit"
      );
    }
    user.password = newPassword;
    state = true;
  }

  if (!state) throw new BadRequestError("No changes made");

  await user.save();

  let msg = "";
  if (isEmailChanged) {
    try {
      const res = await sendConfirmationEmail(email);
      if (res.success) msg = " (email sent)";
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Email could not be sent");
    }
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "User updated" + msg,
    user: {
      email: user.email,
      username: user.username,
      isActivated: user.isActivated,
    },
  });
};

const sendConfirmationEmail = async email => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("No user found");

  if (user.isActivated) throw new Error("Email already confirmed");

  const emailToken = user.createEmailJWT();

  const emailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: confirmEmailOptions.subject,
    html: confirmEmailOptions.html(emailToken),
  };

  try {
    await sgMail.send(emailOptions);
    return { success: true, msg: "Email sent" };
  } catch (error) {
    console.log(error);
    throw new Error("Email could not be sent");
  }
};

export {
  login,
  register,
  logout,
  checkAuth,
  resendEmail,
  confirmEmail,
  forgotPassword,
  resetPassword,
  updateUser,
};
