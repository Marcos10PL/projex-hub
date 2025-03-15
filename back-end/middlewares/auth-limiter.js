import reteLimit from "express-rate-limit";

const authLimiter = reteLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 10,
  message: {
    success: false,
    msg: "Too many requests, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default authLimiter;