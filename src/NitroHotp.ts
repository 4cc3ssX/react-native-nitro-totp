import { NitroModules } from 'react-native-nitro-modules';
import type { NitroHOTP as NitroHOTPType } from './specs/NitroHotp.nitro';
import type {
  NitroHOTPGenerateOptions,
  NitroHOTPValidateOptions,
  OTPAuthURLOptions,
} from './types';
import { SupportedAlgorithm } from './types';
import { NitroTotpConstants } from './constants';

/**
 * NitroHotp (HMAC-based One-Time Password) class that provides methods for generating and validating HOTPs.
 */
export class NitroHotp {
  private nitroHOTP: NitroHOTPType;

  constructor() {
    this.nitroHOTP =
      NitroModules.createHybridObject<NitroHOTPType>('NitroHOTP');
  }

  /**
   * Generates an HOTP code based on the secret key and options.
   *
   * @param secret - The secret key to use for generating the HOTP.
   * @param options - Optional parameters for HOTP generation.
   * @returns The generated HOTP code as a string.
   */
  generate(secret: string, options: NitroHOTPGenerateOptions = {}): string {
    if (!options.digits) {
      options.digits = NitroTotpConstants.DEFAULT_DIGITS;
    }

    if (!options.algorithm) {
      options.algorithm = NitroTotpConstants.DEFAULT_ALGORITHM;
    }

    if (!options.counter) {
      options.counter = NitroTotpConstants.DEFAULT_COUNTER;
    }

    return this.nitroHOTP.generate(secret, options);
  }

  /**
   * Validates an HOTP code against the secret key and options.
   *
   * @param secret - The secret key to validate against.
   * @param otp - The HOTP code to validate.
   * @param options - Optional parameters for HOTP validation.
   * @returns True if the HOTP code is valid, false otherwise.
   */
  validate(
    secret: string,
    otp: string,
    options: NitroHOTPValidateOptions = {}
  ): boolean {
    if (!options.digits) {
      options.digits = NitroTotpConstants.DEFAULT_DIGITS;
    }

    if (!options.algorithm) {
      options.algorithm = NitroTotpConstants.DEFAULT_ALGORITHM;
    }

    if (!options.counter) {
      options.counter = NitroTotpConstants.DEFAULT_COUNTER;
    }

    return this.nitroHOTP.validate(secret, otp, options);
  }

  /**
   * Generates an OTP Auth URL for HOTP that can be used to set up authenticator apps.
   *
   * @param options - The options for generating the auth URL.
   * @returns The generated OTP Auth URL as a string.
   */
  generateAuthURL(options: OTPAuthURLOptions): string {
    return this.generateHotpAuthURL(options);
  }

  /**
   * Gets the algorithm name as a string.
   *
   * @param algorithm - The algorithm enum value.
   * @returns The algorithm name.
   */
  private getAlgorithmName(algorithm: SupportedAlgorithm): string {
    switch (algorithm) {
      case SupportedAlgorithm.SHA1:
        return 'SHA1';
      case SupportedAlgorithm.SHA256:
        return 'SHA256';
      case SupportedAlgorithm.SHA512:
        return 'SHA512';
      default:
        throw new Error('Unsupported algorithm');
    }
  }

  /**
   * Generates an OTP Auth URL for HOTP.
   *
   * @param options - The options for generating the auth URL.
   * @returns The generated OTP Auth URL as a string.
   */
  private generateHotpAuthURL(options: OTPAuthURLOptions): string {
    if (!options.secret) {
      throw new Error('Secret is required.');
    }

    const {
      secret,
      label = 'OTP Auth',
      issuer = '',
      issuerInLabel = false,
      algorithm = SupportedAlgorithm.SHA1,
      digits = NitroTotpConstants.DEFAULT_DIGITS,
      counter = NitroTotpConstants.DEFAULT_COUNTER,
    } = options;

    let url = 'otpauth://hotp/';

    if (issuer) {
      if (issuerInLabel) {
        url += `${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?issuer=${encodeURIComponent(issuer)}&`;
      } else {
        url += `${encodeURIComponent(label)}?issuer=${encodeURIComponent(issuer)}&`;
      }
    } else {
      url += `${encodeURIComponent(label)}?`;
    }

    url += `secret=${encodeURIComponent(secret)}&`;
    url += `algorithm=${encodeURIComponent(this.getAlgorithmName(algorithm))}&`;
    url += `digits=${digits}&`;
    url += `counter=${counter}`;

    return url;
  }
}
