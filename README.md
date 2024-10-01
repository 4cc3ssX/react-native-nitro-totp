# react-native-nitro-totp

## Installation
```
# npm
npm install react-native-nitro-totp

# yarn
yarn add react-native-nitro-totp
```
Extra installation steps for [Nitro Modules](https://mrousavy.github.io/nitro/) can be found [here](https://mrousavy.github.io/nitro/docs/for-users)

## Usage
```ts
import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroSecret,
  NitroTotp,
  parseSecretKey,
} from 'react-native-nitro-totp';

const secret = NitroSecret.generate();

// TOTP
const otp = NitroTotp.generate(secret);
const isValid = NitroTotp.validate(secret, otp);
const generatedAuthURL = NitroTotp.generateAuthURL({
  secret,
  issuer: 'NitroTotp',
  label: 'NitroTotp',
  period: defaultOptions.period,
  digits: defaultOptions.digits,
  issuerInLabel: false,
  algorithm: SupportedAlgorithm.SHA1,
});

// HOTP
const otp = NitroHOTP.generate(secret);
const isValid = NitroHOTP.validate(secret, otp);
const generatedAuthURL = NitroHOTP.generateAuthURL({
  secret,
  issuer: 'NitroHotp',
  label: 'NitroHotp',
  counter: defaultOptions.counter,
  digits: defaultOptions.digits,
  issuerInLabel: false,
  algorithm: SupportedAlgorithm.SHA1,
});

```

## Generation Options
```ts
export interface BaseGenerateOptions {
  /**
   * The number of digits in the OTP.
   * @type {number}
   * @default 6
   */
  digits?: number

  /**
   * The algorithm to use for generating the OTP.
   * @type {SupportedAlgorithm}
   * @default 'SHA1'
   */
  algorithm?: SupportedAlgorithm
}

export interface NitroTotpGenerateOptions extends BaseGenerateOptions {
  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number
}

export interface NitroHOTPGenerateOptions extends BaseGenerateOptions {
  /**
   * The counter to use for generating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number
}
```

## Validation Options
```ts
export interface BaseValidateOptions extends BaseGenerateOptions {
  /**
   * The window of time steps to allow for OTP validation.
   * @type {number}
   * @default 1
   */
  window?: number
}

export interface NitroHOTPValidateOptions extends BaseValidateOptions {
  /**
   * The counter to use for validating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number
}

export interface NitroTotpValidateOptions extends BaseValidateOptions {
  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number
}
```

## OTP Auth URL Options
```ts
export interface OTPAuthURLOptions extends BaseGenerateOptions {
  /**
   * The issuer of the secret key.
   * @type {string}
   */
  issuer?: string

  /**
   * The label of the secret key.
   * @type {string}
   */
  label?: string

  /**
   * The secret key to use for generating the OTP.
   * @type {string}
   */
  secret: string

  /**
   * Whether to include the issuer in the label.
   * @type {boolean}
   * @default false
   */
  issuerInLabel?: boolean

  /**
   * The period in seconds.
   * @type {number}
   * @default 30
   */
  period?: number

  /**
   * The counter to use for generating the OTP.
   * @type {number}
   * @default 0
   */
  counter?: number
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [react-native-nitro-modules](https://github.com/callstack/react-native-builder-bob)
