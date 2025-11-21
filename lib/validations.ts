import { z } from 'zod';

export const createLinkSchema = z.object({
  url: z.string().url('Invalid URL format'),
  code: z.string()
    .regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters')
    .optional()
});

export const codeParamSchema = z.object({
  code: z.string().regex(/^[A-Za-z0-9]{6,8}$/)
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
