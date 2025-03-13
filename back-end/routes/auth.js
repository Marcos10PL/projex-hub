import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  resendEmail,
  confirmEmail,
} from "../controllers/auth.js";
import auth from "../middlewares/authentication.js";

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .post("/logout", logout)

  .get("/check", auth, checkAuth)

  .post("/confirm-email", confirmEmail)
  .post("/resend-confirm-email", resendEmail)

  // .post("/forgot-password", forgotPassword)
  // .post("/reset-password", resetPassword);

export default router;
