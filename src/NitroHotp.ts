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
  generate(secret: string, options?: NitroHOTPGenerateOptions): string {
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
    options?: NitroHOTPValidateOptions
  ): boolean {
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
   * Encodes a string for use in a URI component.
   *
   * @param str - The string to encode.
   * @returns The URI-encoded string.
   */
  private encodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
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
        url += `${this.encodeURIComponent(issuer)}:${this.encodeURIComponent(label)}?issuer=${this.encodeURIComponent(issuer)}&`;
      } else {
        url += `${this.encodeURIComponent(label)}?issuer=${this.encodeURIComponent(issuer)}&`;
      }
    } else {
      url += `${this.encodeURIComponent(label)}?`;
    }

    url += `secret=${this.encodeURIComponent(secret)}&`;
    url += `algorithm=${this.encodeURIComponent(this.getAlgorithmName(algorithm))}&`;
    url += `digits=${digits}&`;
    url += `counter=${counter}`;

    return url;
  }
}
