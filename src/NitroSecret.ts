import { NitroModules } from 'react-native-nitro-modules';
import type { NitroSecret as NitroSecretType } from './specs/NitroSecret.nitro';
import type { GenerateSecretKeyOptions } from './types';
import { NitroTotpConstants, SecretSizeBytes } from './constants';
import { SecretSize } from './types';

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
   * @param options - Optional parameters for secret generation.
   * @returns The generated secret as a Base32-encoded string.
   */
  generate(options: GenerateSecretKeyOptions = {}): string {
    const size = options.size ?? NitroTotpConstants.DEFAULT_SECRET_SIZE;
    const sizeInBytes = this.convertToBytes(size);

    return this.nitroSecret.generate({ size: sizeInBytes });
  }

  /**
   * Validates if the given secret key has a valid format.
   * @param secretKey - The secret key to check.
   * @param options - Optional parameters for secret validation.
   * @returns True if the secret key format is valid, false otherwise.
   */
  isValid(secretKey: string, options: GenerateSecretKeyOptions = {}): boolean {
    if (!options.size) {
      options.size = SecretSize.STANDARD;
    }

    const cleanedKey = secretKey.replace(/[-=\s]/g, '').toUpperCase();
    const expectedLength = this.getExpectedLength(options.size);

    return cleanedKey.length === expectedLength;
  }

  /**
   * Determines expected Base32 character length for validation.
   * Returns one of the standard lengths if no specific size is provided.
   */
  private getExpectedLength(size: number | SecretSize): number {
    const sizeInBytes = this.convertToBytes(size);
    return Math.ceil((sizeInBytes * 8) / 5);
  }

  /**
   * Converts SecretSize enum or raw bytes to validated byte count.
   * Centralizes all size conversion and validation logic.
   */
  private convertToBytes(size: number | SecretSize): number {
    if (typeof size !== 'number') {
      throw new Error('Invalid secret size type');
    }

    // Handle enum values first
    if (size in SecretSize) {
      return SecretSizeBytes[size as SecretSize];
    }

    // Handle raw byte values with validation
    this.validateByteSize(size);
    return size;
  }

  /**
   * Validates byte size against allowed standard sizes.
   * Throws descriptive error for invalid sizes to guide developers.
   */
  private validateByteSize(size: number): void {
    const validBytes = Object.values(SecretSizeBytes);

    if (!validBytes.includes(size as any)) {
      const sizeInfo = Object.entries(SecretSizeBytes)
        .map(([key, bytes]) => `${SecretSize[key as any]}=${bytes}bytes`)
        .join(', ');
      throw new Error(`Secret size must be one of: ${sizeInfo}`);
    }
  }
}
