import { NitroModules } from 'react-native-nitro-modules'
import type { NitroTotp as NitroTotpType } from './specs/NitroTotp.nitro'
import type { NitroSecret as NitroSecretType } from './specs/NitroSecret.nitro'
import type { NitroHOTP as NitroHOTPType } from './specs/NitroHotp.nitro'

export const NitroTotp =
  NitroModules.createHybridObject<NitroTotpType>('NitroTotp')

export const NitroSecret =
  NitroModules.createHybridObject<NitroSecretType>('NitroSecret')

export const NitroHOTP =
  NitroModules.createHybridObject<NitroHOTPType>('NitroHOTP')

export * from './utils'
export * from './types'
export * from './constants'
