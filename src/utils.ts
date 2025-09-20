import { defaultOptions } from './constants';
import type { BaseGenerateOptions, GenerateSecretKeyOptions } from './types';

/**
 * Calculates the expected length of a Base32-encoded string given the input byte length.
 *
 * @param {number} byteLength - The length of the input in bytes.
 * @returns {number} The expected length of the Base32-encoded string.
 */
const getBase32EncodedLength = (byteLength: number): number => {
  const bits = byteLength * 8;
  const base32Digits = Math.ceil(bits / 5);
  // Base32 padding ensures the length is a multiple of 8
  const paddingLength = (8 - (base32Digits % 8)) % 8;
  return base32Digits + paddingLength;
};

/**
 * Checks if the given OTP (One-Time Password) has a valid format.
 *
 * @param {string} otp - The OTP to check.
 * @param {GenerateOptions} [options=defaultOptions] - The options for OTP generation (optional).
 * @returns {boolean} True if the OTP format is valid, false otherwise.
 */
export const isOTPValid = (
  otp: string,
  options: BaseGenerateOptions = defaultOptions
): boolean => {
  const cleanedOtp = otp.replace(/\D+/g, '');
  const digits = options.digits || defaultOptions.digits;
  return cleanedOtp.length === digits;
};

/**
 * Checks if the given secret key has a valid format.
 *
 * @param {string} secretKey - The secret key to check.
 * @param {GenerateSecretKeyOptions} [options=defaultOptions] - The options for secret key generation (optional).
 * @returns {boolean} True if the secret key format is valid, false otherwise.
 */
export const isSecretKeyValid = (
  secretKey: string,
  options: GenerateSecretKeyOptions = defaultOptions
): boolean => {
  const cleanedKey = secretKey.replace(/[-=\s]/g, '').toUpperCase();
  const lengthInBytes = options.length || defaultOptions.length;
  const expectedLength = getBase32EncodedLength(lengthInBytes);
  if (cleanedKey.length !== expectedLength) {
    return false;
  }
  // Check if the secret key contains only valid Base32 characters
  const base32Regex = /^[A-Z2-7]+$/;
  return base32Regex.test(cleanedKey);
};

/**
 * Formats the secret key for display by inserting hyphens every 4 characters.
 *
 * @param {string} secretKey - The secret key to format.
 * @returns {string} The formatted secret key.
 */
export const formatSecretKey = (secretKey: string): string => {
  const cleanedKey = secretKey.replace(/[-=\s]/g, '').toUpperCase();
  // Group the secret key into chunks of 4 characters
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
  // Group digits in the OTP (e.g., '123456' => '123 456')
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
