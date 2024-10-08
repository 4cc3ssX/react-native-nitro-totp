import type { HybridObject } from 'react-native-nitro-modules'
import type {
  NitroTotpGenerateOptions,
  NitroTotpValidateOptions,
  OTPAuthURLOptions,
} from '../types'

export interface NitroTotp
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  generate(secret: string, options?: NitroTotpGenerateOptions): string
  validate(
    secret: string,
    otp: string,
    options?: NitroTotpValidateOptions
  ): boolean
  generateAuthURL(options: OTPAuthURLOptions): string
}
