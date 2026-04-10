import { z } from 'zod';

// ===== Reusable field schemas =====
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .max(255, 'Email must be under 255 characters.')
  .email('Invalid email address.');

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters.')
  .max(128, 'Password must be under 128 characters.')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/[0-9]/, 'Password must contain a number.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character.');

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required.')
  .max(100, 'Name must be under 100 characters.')
  .regex(/^[a-zA-Z\u0600-\u06FF\s'.,-]+$/, 'Name contains invalid characters.');

export const textFieldSchema = (label: string, max = 200) =>
  z.string().trim().max(max, `${label} must be under ${max} characters.`);

// ===== Login schema =====
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

// ===== Sign-up schemas =====
export const signUpBaseSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: nameSchema,
});

export const studentSignUpSchema = signUpBaseSchema.extend({
  university: z.string().trim().min(1, 'University is required.').max(200),
  major: z.string().trim().min(1, 'Major is required.').max(200),
  gpa: z.number().min(0).max(5),
  gpa_scale: z.enum(['4', '5']),
});

export const hrSignUpSchema = signUpBaseSchema.extend({
  company_name: z.string().trim().min(1, 'Company name is required.').max(200),
  position: z.string().trim().max(200).optional(),
  industry: z.string().trim().max(200).optional(),
});

export const universitySignUpSchema = signUpBaseSchema.extend({
  university_name: z.string().trim().min(1, 'University name is required.').max(200),
  official_domain: z.string().trim().max(200).optional(),
  admin_contact: z.string().trim().max(255).optional(),
});

// ===== Sanitization =====
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
