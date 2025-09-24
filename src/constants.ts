import { SupportedAlgorithm, SecretSize } from './types';

export const NitroTotpConstants = {
  DEFAULT_DIGITS: 6,
  DEFAULT_PERIOD: 30,
  DEFAULT_SECRET_SIZE: SecretSize.STANDARD,
  DEFAULT_WINDOW: 1,
  DEFAULT_COUNTER: 0,
  DEFAULT_ALGORITHM: SupportedAlgorithm.SHA1,
} as const;

export const SecretSizeBytes: Record<SecretSize, number> = {
  [SecretSize.COMPACT]: 16, // 26 Base32 chars
  [SecretSize.STANDARD]: 20, // 32 Base32 chars
  [SecretSize.EXTENDED]: 32, // 52 Base32 chars
} as const;

export const defaultOptions = {
  issuer: '',
  label: 'OTP Auth',
  size: SecretSizeBytes[SecretSize.STANDARD],
  digits: NitroTotpConstants.DEFAULT_DIGITS,
  period: NitroTotpConstants.DEFAULT_PERIOD,
  counter: NitroTotpConstants.DEFAULT_COUNTER,
  window: NitroTotpConstants.DEFAULT_WINDOW,
} as const;
