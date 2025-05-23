import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  resendEmail,
  confirmEmail,
  forgotPassword,
  resetPassword,
  updateUser,
  getUsers,
} from "../controllers/auth.js";
import auth from "../middlewares/authentication.js";
import authLimiter from "../middlewares/auth-limiter.js";

const router = express.Router();

router
  .post("/register", authLimiter, register)
  .post("/login", authLimiter, login)
  .post("/logout", logout)
  
  .patch("/update-profile", auth, authLimiter, updateUser)
  .get("/users", auth, getUsers)
  .get("/check", auth, checkAuth)

  .post("/confirm-email", authLimiter, confirmEmail)
  .post("/resend-confirm-email", resendEmail)

  .post("/forgot-password", authLimiter, forgotPassword)
  .post("/reset-password", resetPassword);

export default router;
