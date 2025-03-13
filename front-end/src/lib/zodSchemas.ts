import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
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

export const loginSchema = z.object({
  login: z.string().min(3, "Login must be at least 3 characters long"),
  password: userSchema.shape.password,
});

export const registerSchema = userSchema.omit({ _id: true })

export type User = z.infer<typeof userSchema>;
