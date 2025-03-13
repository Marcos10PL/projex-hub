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

  if (!user) throw new UnauthenticatedError("Invalid credentials");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new UnauthenticatedError("Invalid credentials");

  const token = user.createJWT();

  res.cookie("token", token, tokenOptions);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "User logged in",
    user: { email: user.email, username: user.username },
  });
};

const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    throw new NotFoundError("Please provide all fields");

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new BadRequestError("User already exists");

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
    throw new BadRequestError(
      "Sorry, something went wrong (email could not be sent)"
    );
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
  const { email } = req.body;

  if (!email) throw new BadRequestError("Please provide an email");

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError("No user with that email");

  if (user.isActivated) throw new BadRequestError("Email already confirmed");

  const emailToken = user.createEmailJWT();

  const emailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: confirmEmailOptions.subject,
    html: confirmEmailOptions.html(emailToken),
  };

  try {
    await sgMail.send(emailOptions);
    res.status(StatusCodes.OK).json({ success: true, msg: "Email sent" });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(
      "Sorry, something went wrong (email could not be sent)"
    );
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Please provide an email");

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError("No user with that email");

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
    throw new BadRequestError(
      "Sorry, something went wrong (email could not be sent)"
    );
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

    if (!password.match(passwordRegex)) {
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain an uppercase letter and a digit"
      );
    }

    user.password = password;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, msg: "Password reset" });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      throw new BadRequestError("Invalid or malformed token");

    throw error;
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
};
