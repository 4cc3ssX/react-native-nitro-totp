import type { HybridObject } from 'react-native-nitro-modules';
import type {
  NitroHOTPGenerateOptions,
  NitroHOTPValidateOptions,
} from '../types';

export interface NitroHOTP
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  generate(secret: string, options?: NitroHOTPGenerateOptions): string;
  validate(
    secret: string,
    otp: string,
    options?: NitroHOTPValidateOptions
  ): boolean;
}
