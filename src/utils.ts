import { defaultOptions } from './constants';
import type { BaseGenerateOptions } from './types';

/**
 * Checks if the given OTP (One-Time Password) has a valid format.
 *
 * @param {string} otp - The OTP to check.
 * @param {GenerateOptions} [options=defaultOptions] - The options for OTP generation (optional).
 * @returns {boolean} True if the OTP format is valid, false otherwise.
 */
export const isValidOTP = (
  otp: string,
  options: BaseGenerateOptions
): boolean => {
  const cleanedOtp = otp.replace(/\D+/g, '');
  const digits = options.digits || defaultOptions.digits;
  return cleanedOtp.length === digits;
};

/**
 * Formats the secret key for display by inserting hyphens every 4 characters.
 *
 * @param {string} secretKey - The secret key to format.
 * @returns {string} The formatted secret key.
 */
export const formatSecretKey = (secretKey: string): string => {
  const cleanedKey = secretKey.replace(/[-=\s]/g, '').toUpperCase();
  return cleanedKey.match(/.{1,4}/g)?.join('-') ?? secretKey;
};

/**
 * Formats an OTP (One-Time Password) by grouping digits for readability.
 *
 * @param {string} otp - The OTP to format.
 * @returns {string} The formatted OTP.
 */
export const formatOTP = (otp: string): string => {
  const cleanedOtp = otp.replace(/\D+/g, '');
  return cleanedOtp.replace(/(\d{3})(?=\d)/g, '$1 ');
};

/**
 * Parses the secret key by removing any hyphens from it.
 *
 * @param {string} secretKey - The secret key to parse.
 * @returns {string} The parsed secret key.
 */
export const parseSecretKey = (secretKey: string): string => {
  return secretKey.replace(/[-=\s]/g, '').toUpperCase();
};
