import { NitroModules } from 'react-native-nitro-modules'
import type { NitroTotp as NitroTotpType } from './specs/NitroTotp.nitro'

export const NitroTotp =
  NitroModules.createHybridObject<NitroTotpType>('NitroTotp')
