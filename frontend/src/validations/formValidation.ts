import * as z from "zod";

export const signUpFormValidation = z.object({
  full_name: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInFormValidation = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileFormValidation = z.object({
  full_name: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  profile_pic: z.string().optional(),
});

export type SingUpData = z.infer<typeof signUpFormValidation>;
export type SingInData = z.infer<typeof signInFormValidation>;
export type UpdateProfileData = z.infer<typeof updateProfileFormValidation>;
