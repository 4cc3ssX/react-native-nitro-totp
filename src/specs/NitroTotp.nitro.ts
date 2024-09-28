import type { HybridObject } from 'react-native-nitro-modules'
import type { GenerateOptions, GenerateSecretKeyOptions } from '../types'

export interface NitroTotp
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  generateSecretKey(options: GenerateSecretKeyOptions): string
  generate(secret: string, options: GenerateOptions): string
  validate(secret: string, otp: string, options: GenerateOptions): boolean
}
