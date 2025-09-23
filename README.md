# react-native-nitro-totp

A high-performance React Native library for generating and validating Time-based One-Time Passwords (TOTP) and HMAC-based One-Time Passwords (HOTP) using [Nitro Modules](https://nitro.margelo.com/) for native performance.

## Features

- 🚀 **Native Performance**: Built with Nitro Modules for maximum performance
- 🔐 **TOTP Support**: Generate time-based OTPs compatible with Google Authenticator, Authy, etc.
- 🔢 **HOTP Support**: Generate counter-based OTPs
- 🛡️ **Multiple Algorithms**: Support for SHA1, SHA256, and SHA512
- 📱 **QR Code URLs**: Generate otpauth:// URLs for easy QR code integration
- ✅ **Validation**: Built-in OTP validation with configurable time windows
- 🔧 **Utility Functions**: Helper functions for formatting and parsing secret keys
- 📚 **TypeScript**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
# npm
npm install react-native-nitro-totp react-native-nitro-modules

# yarn
yarn add react-native-nitro-totp react-native-nitro-modules

# pnpm
pnpm add react-native-nitro-totp react-native-nitro-modules
```

> **Note**: `react-native-nitro-modules` is required as this library relies on [Nitro Modules](https://nitro.margelo.com/) for native performance.

## Quick Start

```ts
import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroSecret,
  NitroTotp,
  NitroHotp,
  parseSecretKey,
  SupportedAlgorithm,
} from 'react-native-nitro-totp';

// Create instances
const nitroSecret = new NitroSecret();
const nitroTotp = new NitroTotp();
const nitroHotp = new NitroHotp();

// Generate a secret key
const secretKey = nitroSecret.generate();
const formattedSecret = formatSecretKey(secretKey);

// Generate TOTP
const totpCode = nitroTotp.generate(parseSecretKey(formattedSecret));
console.log('TOTP Code:', formatOTP(totpCode)); // e.g., "123 456"

// Validate TOTP
const isValid = nitroTotp.validate(parseSecretKey(formattedSecret), totpCode);
console.log('Is valid:', isValid); // true

// Generate HOTP
const hotpCode = nitroHotp.generate(parseSecretKey(formattedSecret), { counter: 0 });
console.log('HOTP Code:', formatOTP(hotpCode)); // e.g., "654 321"
```

## Complete Example

Here's a complete example showing all major features:

```ts
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroSecret,
  NitroTotp,
  NitroHotp,
  parseSecretKey,
  SupportedAlgorithm,
} from 'react-native-nitro-totp';

export default function TotpExample() {
  const [secretKey, setSecretKey] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Create instances
  const nitroSecret = new NitroSecret();
  const nitroTotp = new NitroTotp();
  const nitroHotp = new NitroHotp();

  // Generate a new secret key
  const generateSecret = () => {
    const secret = nitroSecret.generate();
    const formatted = formatSecretKey(secret);
    setSecretKey(formatted);
  };

  // Generate TOTP code
  const generateTOTP = useCallback(() => {
    if (!secretKey || !isSecretKeyValid(secretKey)) return;
    
    const secret = parseSecretKey(secretKey);
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, [secretKey]);

  // Generate Auth URL for QR codes
  const generateAuthURL = () => {
    if (!secretKey) return '';
    
    const secret = parseSecretKey(secretKey);
    return nitroTotp.generateAuthURL({
      secret,
      issuer: 'My App',
      label: 'user@example.com',
      algorithm: SupportedAlgorithm.SHA1,
      digits: 6,
      period: 30,
    });
  };

  // Update timer and regenerate TOTP when needed
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = 30 - Math.floor((now / 1000) % 30);
      setTimeRemaining(timeLeft);
      
      if (timeLeft === 30) {
        generateTOTP();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generateTOTP]);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Generate Secret" onPress={generateSecret} />
      
      <TextInput
        value={secretKey}
        onChangeText={setSecretKey}
        placeholder="Secret key"
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />
      
      <Text>TOTP Code: {totpCode}</Text>
      <Text>Time remaining: {timeRemaining}s</Text>
      
      <Button title="Generate TOTP" onPress={generateTOTP} />
    </View>
  );
}
```

## API Reference

### Classes

#### `NitroSecret`

Handles secret key generation and management.

```ts
const nitroSecret = new NitroSecret();

// Generate a new secret key
const secret = nitroSecret.generate(options?: GenerateSecretKeyOptions);
```

#### `NitroTotp`

Handles Time-based One-Time Password operations.

```ts
const nitroTotp = new NitroTotp();

// Generate TOTP
const code = nitroTotp.generate(secret: string, options?: NitroTotpGenerateOptions);

// Validate TOTP
const isValid = nitroTotp.validate(secret: string, otp: string, options?: NitroTotpValidateOptions);

// Generate Auth URL
const url = nitroTotp.generateAuthURL(options: OTPAuthURLOptions);
```

#### `NitroHotp`

Handles HMAC-based One-Time Password operations.

```ts
const nitroHotp = new NitroHotp();

// Generate HOTP
const code = nitroHotp.generate(secret: string, options?: NitroHOTPGenerateOptions);

// Validate HOTP
const isValid = nitroHotp.validate(secret: string, otp: string, options?: NitroHOTPValidateOptions);

// Generate Auth URL
const url = nitroHotp.generateAuthURL(options: OTPAuthURLOptions);
```

### Utility Functions

```ts
// Format OTP for display (adds space in middle)
formatOTP(otp: string): string // "123456" → "123 456"

// Format secret key for display (adds dashes)
formatSecretKey(secret: string): string // "JBSWY3DP..." → "JBSW-Y3DP-..."

// Parse formatted secret key back to plain string
parseSecretKey(secret: string): string // "JBSW-Y3DP-..." → "JBSWY3DP..."

// Validate secret key format
isSecretKeyValid(secret: string, options?: GenerateSecretKeyOptions): boolean

// Validate OTP format
isOTPValid(otp: string, options?: BaseGenerateOptions): boolean
```

### Types and Interfaces

#### Supported Algorithms

```ts
enum SupportedAlgorithm {
  SHA1 = 0,    // Default, most compatible
  SHA256 = 1,  // More secure
  SHA512 = 2,  // Most secure
}
```

#### Generation Options

```ts
interface BaseGenerateOptions {
  digits?: number;              // Default: 6
  algorithm?: SupportedAlgorithm; // Default: SHA1
}

interface NitroTotpGenerateOptions extends BaseGenerateOptions {
  period?: number;              // Default: 30 seconds
}

interface NitroHOTPGenerateOptions extends BaseGenerateOptions {  
  counter?: number;             // Default: 0
}

interface GenerateSecretKeyOptions {
  length?: number;              // Default: 20 bytes
}
```

#### Validation Options

```ts
interface BaseValidateOptions extends BaseGenerateOptions {
  window?: number;              // Default: 1 (±1 time step tolerance)
}

interface NitroTotpValidateOptions extends BaseValidateOptions {
  period?: number;              // Default: 30 seconds
}

interface NitroHOTPValidateOptions extends BaseValidateOptions {
  counter?: number;             // Default: 0
}
```

#### Auth URL Options

```ts
interface OTPAuthURLOptions extends BaseGenerateOptions {
  secret: string;               // Required: Base32 secret key
  issuer?: string;              // App/service name
  label?: string;               // Account identifier
  issuerInLabel?: boolean;      // Default: false
  period?: number;              // TOTP only, default: 30
  counter?: number;             // HOTP only, default: 0
}
```

## Usage Examples

### Basic TOTP

```ts
import { NitroSecret, NitroTotp, formatOTP, parseSecretKey } from 'react-native-nitro-totp';

const nitroSecret = new NitroSecret();
const nitroTotp = new NitroTotp();

const secret = nitroSecret.generate();
const code = nitroTotp.generate(secret);
const formattedCode = formatOTP(code); // "123 456"
```

### Custom TOTP with SHA256

```ts
import { SupportedAlgorithm } from 'react-native-nitro-totp';

const code = nitroTotp.generate(secret, {
  algorithm: SupportedAlgorithm.SHA256,
  digits: 8,
  period: 60, // 1 minute intervals
});
```

### HOTP with Counter

```ts
import { NitroHotp } from 'react-native-nitro-totp';

const nitroHotp = new NitroHotp();
let counter = 0;

const generateNextHOTP = () => {
  const code = nitroHotp.generate(secret, { counter });
  counter++; // Increment for next use
  return code;
};
```

### Generating QR Code URLs

```ts
// For TOTP (Google Authenticator compatible)
const totpUrl = nitroTotp.generateAuthURL({
  secret: parseSecretKey(secretKey),
  issuer: 'My Awesome App',
  label: 'user@example.com',
  algorithm: SupportedAlgorithm.SHA1,
  digits: 6,
  period: 30,
});

// For HOTP
const hotpUrl = nitroHotp.generateAuthURL({
  secret: parseSecretKey(secretKey),
  issuer: 'My Awesome App', 
  label: 'user@example.com',
  algorithm: SupportedAlgorithm.SHA1,
  digits: 6,
  counter: 0,
});
```

### Validation with Time Window

```ts
// Allow ±1 time step (±30 seconds by default)
const isValid = nitroTotp.validate(secret, userEnteredOTP, {
  window: 1, // Accept codes from previous/current/next time step
});

// More permissive validation (±2 time steps)
const isValidPermissive = nitroTotp.validate(secret, userEnteredOTP, {
  window: 2, // Accept codes from ±60 seconds
});
```

## Best Practices

### Security Considerations

1. **Secret Key Storage**: Always store secret keys securely using:
   - iOS: Keychain Services
   - Android: Android Keystore
   - Consider using libraries like `react-native-keychain`

2. **Secret Key Generation**: Use the built-in `NitroSecret.generate()` for cryptographically secure keys

3. **Validation Windows**: Use appropriate time windows - larger windows are more user-friendly but less secure

4. **Algorithm Choice**: 
   - SHA1: Most compatible with existing authenticator apps
   - SHA256/SHA512: More secure but ensure compatibility

### Performance Tips

1. **Instance Reuse**: Create class instances once and reuse them:
   ```ts
   // ✅ Good - create once, reuse
   const nitroTotp = new NitroTotp();
   
   // ❌ Avoid - creating new instances repeatedly
   const generateCode = () => new NitroTotp().generate(secret);
   ```

2. **Batch Operations**: When validating multiple OTPs, reuse the same instance

### Error Handling

```ts
import { isSecretKeyValid, isOTPValid } from 'react-native-nitro-totp';

const generateTOTP = (secretKey: string) => {
  // Validate secret key first
  if (!isSecretKeyValid(secretKey)) {
    throw new Error('Invalid secret key format');
  }
  
  try {
    const secret = parseSecretKey(secretKey);
    return nitroTotp.generate(secret);
  } catch (error) {
    console.error('TOTP generation failed:', error);
    throw error;
  }
};

const validateTOTP = (secretKey: string, otp: string) => {
  // Validate inputs
  if (!isSecretKeyValid(secretKey)) {
    return { valid: false, error: 'Invalid secret key' };
  }
  
  if (!isOTPValid(otp)) {
    return { valid: false, error: 'Invalid OTP format' };
  }
  
  try {
    const secret = parseSecretKey(secretKey);
    const valid = nitroTotp.validate(secret, otp);
    return { valid, error: null };
  } catch (error) {
    return { valid: false, error: 'Validation failed' };
  }
};
```

## Troubleshooting

### Common Issues

1. **"Invalid secret key" errors**:
   - Ensure the secret key is properly Base32 encoded
   - Use `formatSecretKey()` and `parseSecretKey()` for proper formatting
   - Check if the key length matches expected format

2. **TOTP codes don't match authenticator apps**:
   - Verify the time is synchronized on both devices
   - Check algorithm, digits, and period settings match
   - Default settings (SHA1, 6 digits, 30 seconds) work with most apps

3. **Performance issues**:
   - Reuse class instances instead of creating new ones
   - Avoid calling generation/validation in render loops

### Integration with Popular Apps

The library generates standard-compliant OTPs that work with:
- Google Authenticator
- Microsoft Authenticator  
- Authy
- 1Password
- Bitwarden
- And any RFC 6238 (TOTP) / RFC 4226 (HOTP) compliant app

## Platform Support

- ✅ iOS 11.0+
- ✅ Android API 21+
- ✅ Expo (with development builds)
- ❌ Expo Go (requires native modules)

## Contributing

We welcome contributions! Please see our contributing guidelines:

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Nitro Modules](https://nitro.margelo.com/) for native performance
- Implements [RFC 6238 (TOTP)](https://tools.ietf.org/html/rfc6238) and [RFC 4226 (HOTP)](https://tools.ietf.org/html/rfc4226) standards
- Created with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

---

<div align="center">
  <strong>⭐ Star this repo if it helped you! ⭐</strong>
</div>
