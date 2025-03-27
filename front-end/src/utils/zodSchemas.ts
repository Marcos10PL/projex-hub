import { z } from "zod";

//----------- types ---------- //
const user = z.object({
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
  isActivated: z.boolean(),
});

export const userSchema = user.merge(
  z.object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter and one number"
      ),
  })
);

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  status: z.enum(["in-progress", "done"]),
  dueDate: z.string().nullish(),
  completedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectSchema = z.object({
  _id: z.string(),
  name: z
    .string()
    .min(3, "Name must be between 3 and 30 characters long")
    .max(50, "Name must be between 3 and 30 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  owner: user.omit({ isActivated: true, email: true }),
  members: z.array(user.omit({ isActivated: true, email: true })),
  tasks: z.array(taskSchema),
  status: z.enum(["planned", "active", "completed", "delayed"]),
  dueDate: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof user>;
export type ProjectType = z.infer<typeof projectSchema>;

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

export const updateProfileSchema = z.object({
  email: z.union([userSchema.shape.email, z.literal("").optional()]),
  username: z.union([userSchema.shape.username, z.literal("").optional()]),
  newPassword: z.union([userSchema.shape.password, z.literal("").optional()]),
  password: userSchema.shape.password,
});

export const createOrUpdateProjectSchema = projectSchema.pick({
  name: true,
  description: true,
});

export type ForgotPassowrdForm = z.infer<typeof forgotPasswordSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
export type CreateOrUpdateProjectForm = z.infer<
  typeof createOrUpdateProjectSchema
>;

//----------- api response ---------- //

export const apiResponseSchema = z.object({
  success: z.boolean(),
  msg: z.string(),
});

export const projectsResponseSchema = apiResponseSchema.merge(
  z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalProjects: z.number(),
    projects: z.array(projectSchema),
  })
);

export const projectResponseSchema = apiResponseSchema.merge(
  z.object({ project: projectSchema })
);

export const loginResponseSchema = apiResponseSchema.merge(z.object({ user }));

export const registerResponseSchema = apiResponseSchema;

export const updateProfileResponseSchema = apiResponseSchema.merge(
  z.object({ user })
);

export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;
