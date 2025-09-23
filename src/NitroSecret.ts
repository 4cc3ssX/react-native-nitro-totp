import { NitroModules } from 'react-native-nitro-modules';
import type { NitroSecret as NitroSecretType } from './specs/NitroSecret.nitro';
import type { GenerateSecretKeyOptions } from './types';
import { NitroTotpConstants } from './constants';

/**
 * NitroSecret class that provides methods for generating cryptographically secure secrets.
 */
export class NitroSecret {
  private nitroSecret: NitroSecretType;

  constructor() {
    this.nitroSecret =
      NitroModules.createHybridObject<NitroSecretType>('NitroSecret');
  }

  /**
   * Generates a cryptographically secure random secret key.
   *
   * @param options - Optional parameters for secret generation.
   * @returns The generated secret as a Base32-encoded string.
   */
  generate(options?: GenerateSecretKeyOptions): string {
    return this.nitroSecret.generate(options);
  }

  /**
   * Generates a secret key with default length.
   *
   * @returns A Base32-encoded secret key with default length.
   */
  generateDefault(): string {
    return this.generate({ length: NitroTotpConstants.DEFAULT_SECRET_SIZE });
  }

  /**
   * Generates a secret key with specified length.
   *
   * @param length - The length of the secret in bytes.
   * @returns A Base32-encoded secret key with the specified length.
   */
  generateWithLength(length: number): string {
    return this.generate({ length });
  }
}
