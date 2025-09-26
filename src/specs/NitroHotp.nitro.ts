import type { HybridObject } from 'react-native-nitro-modules';
import type {
  NitroHotpGenerateOptions,
  NitroHotpValidateOptions,
} from '../types';

export interface NitroHotp
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  generate(secret: string, options: NitroHotpGenerateOptions): string;
  validate(
    secret: string,
    otp: string,
    options: NitroHotpValidateOptions
  ): boolean;
}
