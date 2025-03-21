import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      min: 6,
      max: 255,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      trim: true,
    },
    username: {
      type: String,
      required: true,
      min: 3,
      max: 30,
      unique: true,
      match: [
        /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
        "Username can only contain letters, numbers, underscores and dashes",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    isResetPassTokenExpired: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

userSchema.methods.createEmailJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
