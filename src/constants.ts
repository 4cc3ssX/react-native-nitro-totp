import { SupportedAlgorithm } from './types';

export enum NitroTotpConstants {
  DEFAULT_DIGITS = 6,
  DEFAULT_PERIOD = 30,
  DEFAULT_SECRET_SIZE = 12,
  DEFAULT_WINDOW = 1,
  DEFAULT_COUNTER = 0,
  DEFAULT_ALGORITHM = SupportedAlgorithm.SHA1,
}

export const defaultOptions = {
  issuer: '',
  label: 'OTP Auth',
  length: NitroTotpConstants.DEFAULT_SECRET_SIZE,
  digits: NitroTotpConstants.DEFAULT_DIGITS,
  period: NitroTotpConstants.DEFAULT_PERIOD,
  counter: NitroTotpConstants.DEFAULT_COUNTER,
  window: NitroTotpConstants.DEFAULT_WINDOW,
} as const;
