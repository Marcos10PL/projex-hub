import { UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -__v -_id");
    next();
  } catch (error) {
    throw new UnauthenticatedError(error.message);
  }
};

export default auth;
