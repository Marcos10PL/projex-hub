import { z } from "zod";

//----------- types ---------- //
export const userSchema = z.object({
  email: z
    .string()
    .min(6, "Email must be at least 6 characters long")
    .email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be between 3 and 30 characters long")
    .max(30, "Username must be between 3 and 30 characters long")
    .regex(
      /^[a-zA-Z0-9_]*$/,
      "Username can only contain letters, numbers and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter and one number"
    ),
});

// eslint-disable-next-line
const userSchemaWithoutPassword = userSchema.omit({ password: true });
export type User = z.infer<typeof userSchemaWithoutPassword>;

//----------- validation ---------- //

export const loginSchema = z.object({
  login: z.string().min(3, "Login must be at least 3 characters long"),
  password: userSchema.shape.password,
});

export const registerSchema = userSchema;

export const forgotPasswordSchema = z.object({
  email: userSchema.shape.email,
});

export const resetPasswordSchema = z.object({
  password: userSchema.shape.password,
});

export type ForgotPassowrdForm = z.infer<typeof forgotPasswordSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

//----------- api response ---------- //

export const apiResponseSchema = z.object({
  success: z.boolean(),
  msg: z.string(),
});

export const loginResponseSchema = apiResponseSchema.merge(
  z.object({ user: userSchema.omit({ password: true }) })
);

export const registerResponseSchema = apiResponseSchema;

export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
