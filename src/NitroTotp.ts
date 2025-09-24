import { NitroModules } from 'react-native-nitro-modules';
import type { NitroTotp as NitroTotpType } from './specs/NitroTotp.nitro';
import type {
  NitroTotpGenerateOptions,
  NitroTotpValidateOptions,
  OTPAuthURLOptions,
} from './types';
import { SupportedAlgorithm } from './types';
import { NitroTotpConstants } from './constants';

/**
 * NitroTotp (Time-based One-Time Password) class that provides methods for generating and validating TOTPs.
 */
export class NitroTotp {
  private nitroTotp: NitroTotpType;

  constructor() {
    this.nitroTotp =
      NitroModules.createHybridObject<NitroTotpType>('NitroTotp');
  }

  /**
   * Generates a TOTP code based on the secret key and options.
   *
   * @param secret - The secret key to use for generating the TOTP.
   * @param options - Optional parameters for TOTP generation.
   * @returns The generated TOTP code as a string.
   */
  generate(secret: string, options: NitroTotpGenerateOptions = {}): string {
    if (!options.digits) {
      options.digits = NitroTotpConstants.DEFAULT_DIGITS;
    }

    if (!options.period) {
      options.period = NitroTotpConstants.DEFAULT_PERIOD;
    }

    if (!options.algorithm) {
      options.algorithm = NitroTotpConstants.DEFAULT_ALGORITHM;
    }

    if (!options.currentTime) {
      options.currentTime = Math.floor(Date.now() / 1000);
    }

    return this.nitroTotp.generate(secret, options);
  }

  /**
   * Validates a TOTP code against the secret key and options.
   *
   * @param secret - The secret key to validate against.
   * @param otp - The TOTP code to validate.
   * @param options - Optional parameters for TOTP validation.
   * @returns True if the TOTP code is valid, false otherwise.
   */
  validate(
    secret: string,
    otp: string,
    options: NitroTotpValidateOptions = {}
  ): boolean {
    if (!options.digits) {
      options.digits = NitroTotpConstants.DEFAULT_DIGITS;
    }

    if (!options.period) {
      options.period = NitroTotpConstants.DEFAULT_PERIOD;
    }

    if (!options.algorithm) {
      options.algorithm = NitroTotpConstants.DEFAULT_ALGORITHM;
    }

    if (
      options.window === undefined ||
      options.window === null ||
      options.window < 0
    ) {
      options.window = NitroTotpConstants.DEFAULT_WINDOW;
    }

    if (!options.currentTime || options.currentTime < 0) {
      options.currentTime = Math.floor(Date.now() / 1000);
    }

    return this.nitroTotp.validate(secret, otp, options);
  }

  /**
   * Generates an OTP Auth URL for TOTP that can be used to set up authenticator apps.
   *
   * @param options - The options for generating the auth URL.
   * @returns The generated OTP Auth URL as a string.
   */
  generateAuthURL(options: OTPAuthURLOptions): string {
    return this.generateTotpAuthURL(options);
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
   * Generates an OTP Auth URL for TOTP.
   *
   * @param options - The options for generating the auth URL.
   * @returns The generated OTP Auth URL as a string.
   */
  private generateTotpAuthURL(options: OTPAuthURLOptions): string {
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
      period = NitroTotpConstants.DEFAULT_PERIOD,
    } = options;

    let url = 'otpauth://totp/';

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
    url += `period=${period}`;

    return url;
  }
}
