export enum NitroTotpConstants {
  DEFAULT_DIGITS = 6,
  DEFAULT_PERIOD = 30,
  DEFAULT_SECRET_SIZE = 12,
  DEFAULT_WINDOW = 1,
}

export const defaultOptions = {
  issuer: '',
  label: '',
  length: NitroTotpConstants.DEFAULT_SECRET_SIZE,
  digits: NitroTotpConstants.DEFAULT_DIGITS,
  period: NitroTotpConstants.DEFAULT_PERIOD,
  window: NitroTotpConstants.DEFAULT_WINDOW,
  algorithm: 'SHA1',
} as const
