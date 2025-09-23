import { colors } from '../theme/colors';
import {
  TOTP_PERIOD_SECONDS,
  SECRET_DISPLAY_LENGTH,
  PERCENTAGE_MULTIPLIER,
  TIME_WARNING_THRESHOLD,
  TIME_CRITICAL_THRESHOLD,
} from '../constants';

/**
 * Calculate time remaining for TOTP based on current unix timestamp
 */
export const calculateTimeRemaining = (unixTimestamp: number): number => {
  return TOTP_PERIOD_SECONDS - (unixTimestamp % TOTP_PERIOD_SECONDS);
};

/**
 * Calculate progress percentage based on time remaining
 */
export const getProgressPercentage = (timeRemaining: number): number => {
  return (
    ((TOTP_PERIOD_SECONDS - timeRemaining) / TOTP_PERIOD_SECONDS) *
    PERCENTAGE_MULTIPLIER
  );
};

/**
 * Get progress color based on time remaining
 */
export const getProgressColor = (timeRemaining: number): string => {
  if (timeRemaining > TIME_WARNING_THRESHOLD) return colors.green;
  if (timeRemaining > TIME_CRITICAL_THRESHOLD) return colors.orange;
  return colors.red;
};

/**
 * Format secret key for display (show first N characters)
 */
export const formatSecretForDisplay = (secretKey: string): string => {
  return `${secretKey.substring(0, SECRET_DISPLAY_LENGTH)}...`;
};

/**
 * Format time for display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
