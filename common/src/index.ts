import z from "zod";

export const signupInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export type SigninInput = z.infer<typeof signinInput>;

export const createBlogInput = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  content: z.string().trim().min(1, { message: "Content is required" }),
});
export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1, { message: "Title is required" }),
  content: z.string().trim().min(1, { message: "Content is required" }),
});
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;

export const createCommentInput = z.object({
  content: z.string().trim().min(1, { message: "Content is required" }),
});
export type createCommentInput = z.infer<typeof createCommentInput>;

export const updateUserInput = z.object({
  bio: z.string().optional(),
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});
export type updateUserInput = z.infer<typeof updateUserInput>;
