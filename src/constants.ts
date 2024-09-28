export enum NitroTotpConstants {
  DEFAULT_DIGITS = 6,
  DEFAULT_TIME_STEP = 30,
  DEFAULT_SECRET_KEY_LENGTH = 16,
  DEFAULT_WINDOW = 1,
}

export const defaultOptions = {
  digits: NitroTotpConstants.DEFAULT_DIGITS,
  timeStep: NitroTotpConstants.DEFAULT_TIME_STEP,
  window: NitroTotpConstants.DEFAULT_WINDOW,
  length: NitroTotpConstants.DEFAULT_SECRET_KEY_LENGTH,
}
