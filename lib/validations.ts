import { z } from 'zod';

export const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
