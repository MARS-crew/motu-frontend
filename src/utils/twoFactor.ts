import type { TwoFactor } from '@/schemas/twoFactorSchema';
import { formatDashDateTime } from '@/utils/formatDate';

export function getTwoFactorEnabled(status?: TwoFactor['status']): boolean | undefined {
  return status === undefined ? undefined : status === 'ENABLED';
}

export function formatTwoFactorDate(value?: string | null) {
  return value ? formatDashDateTime(value).replace(/-/g, '.') : '';
}

export function maskContactPhone(value?: string | null) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 ? `${digits.slice(0, 3)}-****-${digits.slice(-4)}` : '';
}
