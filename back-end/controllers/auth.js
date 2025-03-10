import { BadRequestError, NotFoundError } from "../errors/index.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new NotFoundError("Please provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new BadRequestError("Invalid credentials");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");

  const token = user.createJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.JWT_EXPIRES_IN),
    sameSite: "Strict",
  });

  res.status(StatusCodes.OK).json({ name: user.name });
};

const register = async (req, res) => {
  res.send("Register route");
};

export { login, register };
