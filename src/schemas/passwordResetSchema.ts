import { z } from 'zod';

import { resetPasswordSchema } from '@/schemas/accountRecoverySchema';

export const passwordResetTokenSchema = z.object({ token: z.string().trim().min(1) });
export const passwordResetVerificationSchema = z.object({ valid: z.boolean() });
export const confirmPasswordResetSchema = passwordResetTokenSchema.extend({
  newPassword: resetPasswordSchema.shape.password,
});

export type PasswordResetToken = z.infer<typeof passwordResetTokenSchema>;
export type ConfirmPasswordResetRequest = z.infer<typeof confirmPasswordResetSchema>;
