export enum SupportedAlgorithm {
  SHA1,
  SHA256,
  SHA512,
}

export enum SecretSize {
  COMPACT = 0,
  STANDARD = 1,
  EXTENDED = 2,
}

export interface OTPAuthURLOptions extends BaseGenerateOptions {
  /**
   * The issuer of the secret key.
   * @type {string}
   */
  issuer?: string;

  /**
   * The label of the secret key.
   * @type {string}
   */
  label?: string;

  /**
   * The secret key to use for generating the OTP.
   * @type {string}
   */
  secret: string;

  /**
   * Whether to include the issuer in the label.
   * @type {boolean}
   * @default false
   */
  issuerInLabel?: boolean;

  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number;

  /**
   * The counter to use for generating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number;
}

export interface GenerateSecretKeyOptions {
  /**
   * The size of the secret key.
   * @type {number}
   */
  size?: number;
}

export interface NitroTotpGenerateOptions extends BaseGenerateOptions {
  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number;

  /**
   * The current time in seconds since Unix epoch.
   * @type {number}
   * @internal
   */
  currentTime?: number;
}

export interface NitroHotpGenerateOptions extends BaseGenerateOptions {
  /**
   * The counter to use for generating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number;
}

export interface BaseGenerateOptions {
  /**
   * The number of digits in the OTP.
   * @type {number}
   * @default 6
   */
  digits?: number;

  /**
   * The algorithm to use for generating the OTP.
   * @type {SupportedAlgorithm}
   * @default SupportedAlgorithm.SHA1
   */
  algorithm?: SupportedAlgorithm;
}

export interface BaseValidateOptions extends BaseGenerateOptions {
  /**
   * The window of time steps to allow for OTP validation.
   * @type {number}
   * @default 1
   */
  window?: number;
}

export interface NitroHotpValidateOptions extends BaseValidateOptions {
  /**
   * The counter to use for validating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number;
}

export interface NitroTotpValidateOptions extends BaseValidateOptions {
  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number;

  /**
   * The current time in seconds since Unix epoch.
   * @type {number}
   * @internal
   */
  currentTime?: number;
}
