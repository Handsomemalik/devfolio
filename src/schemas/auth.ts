import { z } from "zod";
import { TOP_100_COMMON_PASSWORDS } from "@/lib/security/passwords";

/**
 * Reusable strong password schema
 */
export const strongPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters long")
  .max(128, "Password must be under 128 characters")
  .refine((pwd) => /[A-Z]/.test(pwd), "Must contain at least one uppercase letter")
  .refine((pwd) => /[a-z]/.test(pwd), "Must contain at least one lowercase letter")
  .refine((pwd) => /[0-9]/.test(pwd), "Must contain at least one number")
  .refine(
    (pwd) => !TOP_100_COMMON_PASSWORDS.has(pwd.toLowerCase().trim()),
    "This password is too common and unsafe to use."
  );

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name must be under 60 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const changeEmailSchema = z.object({
  newEmail: z.string().trim().email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required for confirmation"),
});

export const deleteAccountSchema = z.object({
  confirmation: z
    .string()
    .refine((val) => val === "DELETE", 'Type "DELETE" to confirm account deletion'),
  password: z.string().min(1, "Password is required to confirm account deletion"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
