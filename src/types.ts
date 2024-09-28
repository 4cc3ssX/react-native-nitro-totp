export interface GenerateOptions {
  /**
   * The time step in seconds.
   * @type {number}
   */
  timeStep?: number
  /**
   * The number of digits in the OTP.
   * @type {number}
   */
  digits?: number
}

export interface GenerateSecretKeyOptions {
  /**
   * Generates a random secret key of the specified length.
   * @type {number}
   */
  length?: number
}

export interface ValidateOTPOptions extends GenerateOptions {
  /**
   * The window of time to allow for OTP validation, in steps.
   * @type {number}
   * @default 1
   */
  window?: number
}
