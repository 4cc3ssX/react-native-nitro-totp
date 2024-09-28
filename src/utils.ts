import { defaultOptions } from './constants'
import type { GenerateOptions, GenerateSecretKeyOptions } from './types'

/**
 * Checks if the given OTP (One-Time Password) has a valid format.
 *
 * @param {string} otp - The OTP to check.
 * @param {IGenerateOTPOptions} [options=defaultOptions] - The options for OTP generation (optional).
 * @returns {boolean} True if the OTP format is valid, false otherwise.
 */
export const isOTPValid = (
  otp: string,
  options: GenerateOptions = defaultOptions
): boolean => {
  otp = otp.replace(/\D+/g, '')
  return otp.length === options.digits
}

/**
 * Checks if the given secret key has a valid format.
 *
 * @param {string} secretKey - The secret key to check.
 * @param {IGenerateSecretKeyOptions} [options=defaultOptions] - The options for secret key generation (optional).
 * @returns {boolean} True if the secret key format is valid, false otherwise.
 */
export const isSecretKeyValid = (
  secretKey: string,
  options: GenerateSecretKeyOptions = defaultOptions
): boolean => {
  secretKey = secretKey.replace(/-/g, '')
  return secretKey.length === options.length
}

/**
 * Formats the secret key for display by inserting hyphens in a specific pattern.
 * If the secret key is valid, it is formatted as follows: AAAA-BBBB-CCCC-DDDD.
 * If the secret key is invalid, it is returned as is.
 *
 * @param {string} secretKey - The secret key to format.
 * @returns {string} The formatted secret key.
 */
export const formatSecretKey = (secretKey: string): string => {
  const isValid = isSecretKeyValid(secretKey)
  if (isValid) {
    return secretKey.replace(/(.{4})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4')
  }
  return secretKey
}

/**
 * Formats an OTP (One-Time Password) with a specified pattern.
 * @param {string} otp - The OTP to format.
 * @returns {string} The formatted OTP.
 */
export const formatOTP = (otp: string): string => {
  const isValid = isOTPValid(otp)
  if (isValid) {
    return otp.replace(/(\d{3})(?=\d)/g, '$1 ')
  }
  return otp
}

/**
 * Parses the secret key by removing any hyphens from it.
 * If the secret key is valid, the hyphens are removed.
 * If the secret key is invalid, it is returned as is.
 *
 * @param {string} secretKey - The secret key to parse.
 * @returns {string} The parsed secret key.
 */
export const parseSecretKey = (secretKey: string): string => {
  const isValid = isSecretKeyValid(secretKey)
  if (isValid) {
    return secretKey.replace(/-/g, '')
  }
  return secretKey
}
