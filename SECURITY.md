# Security Policy

## Reporting a Vulnerability

At React Native Nitro TOTP, we take security seriously and are committed to maintaining the highest security standards for our TOTP implementation. If you believe you've found a security vulnerability in our library, please follow our responsible disclosure process:

### How to Report

1. **DO NOT** disclose the vulnerability publicly until it has been addressed by our team.

2. **DO NOT** open a GitHub issue for the vulnerability. Instead, please send an email to [hello@ryamjs.dev](mailto:hello@ryamjs.dev) with a detailed description of the issue.

3. **Use the subject line**: `[SECURITY] React Native Nitro TOTP Vulnerability Report`

### Required Information

Please include the following information in your security report:

- **Vulnerability Description**: A clear and detailed description of the vulnerability and its potential impact
- **Attack Vector**: How the vulnerability can be exploited
- **Affected Components**: Which parts of the library are affected (TOTP generation, HOTP, secret handling, etc.)
- **Reproduction Steps**: Step-by-step instructions to reproduce the vulnerability
- **Proof of Concept**: If applicable, include a minimal proof of concept (without causing harm)
- **Version Information**: The version(s) of React Native Nitro TOTP affected
- **Environment Details**: Operating system, React Native version, and other relevant environment information
- **Suggested Fix**: If you have ideas for how to address the issue

### Response Timeline

- **Initial Response**: We will acknowledge your email within **24 hours**
- **Assessment**: We will provide an initial assessment within **72 hours**
- **Resolution**: Critical vulnerabilities will be addressed within **7 days**, others within **30 days**
- **Disclosure**: Once resolved, we will coordinate with you on public disclosure timing

### Recognition

We believe in recognizing security researchers who help make our library safer:
- Security researchers will be credited in our security advisories (unless you prefer to remain anonymous)
- For significant vulnerabilities, we may include recognition in our release notes and README

## Supported Versions

We are committed to maintaining security for our users. Security updates and patches are provided for supported versions only. Please ensure you're using a supported version to receive critical security fixes.

| Version | Support Status | Security Updates | End of Life |
|---------|---------------|------------------|-------------|
| >= 1.0.0 | ✅ **Fully Supported** | ✅ Active | N/A |
| 0.x.x | ❌ **Not Supported** | ❌ None | Deprecated |

### Version Support Policy

- **Latest Major Version**: Full support with security updates, bug fixes, and new features
- **Previous Major Version**: Security updates only for 6 months after new major release
- **Beta/RC Versions**: Not recommended for production use, no security guarantees

**⚠️ Important**: Always use the latest stable version in production environments. Pre-release versions should only be used for testing and development.

## Security Best Practices

### TOTP-Specific Security Guidelines

When implementing React Native Nitro TOTP in your applications, follow these critical security practices:

#### 🔐 Secret Management
- **Secure Storage**: Always store TOTP secrets using secure storage mechanisms (iOS Keychain, Android Keystore)
- **Never Log Secrets**: Ensure secrets are never logged, printed, or exposed in error messages
- **Secret Validation**: Validate secret format and encoding before use
- **Secret Rotation**: Implement secret rotation policies where applicable

#### ⏰ Time Synchronization
- **NTP Sync**: Ensure device time is synchronized with NTP servers
- **Time Skew Tolerance**: Configure appropriate time window tolerance (typically 30-90 seconds)
- **Clock Drift Monitoring**: Monitor and handle clock drift in long-running applications

#### 🛡️ Implementation Security
- **Input Validation**: Validate all inputs (secrets, time steps, algorithms) before processing
- **Memory Safety**: Clear sensitive data from memory after use
- **Error Handling**: Implement secure error handling that doesn't leak sensitive information
- **Rate Limiting**: Implement rate limiting for TOTP verification attempts

#### 📱 Mobile-Specific Considerations
- **Background Protection**: Ensure TOTP codes are not visible in app switcher/screenshots
- **Debug Protection**: Disable debugging features in production builds
- **Root/Jailbreak Detection**: Consider implementing root/jailbreak detection for sensitive applications
- **Secure Communication**: Use certificate pinning when communicating with backend services

### General Security Practices

#### 🔄 Dependency Management
- **Keep Updated**: Always use the latest stable versions of React Native Nitro TOTP and dependencies
- **Audit Dependencies**: Regularly audit dependencies for known vulnerabilities
- **Minimal Dependencies**: Use only necessary dependencies to reduce attack surface

#### 🌐 Network Security
- **HTTPS Only**: Always use HTTPS for all network communications
- **Certificate Validation**: Implement proper SSL/TLS certificate validation
- **API Security**: Secure your backend APIs with proper authentication and authorization

#### 🔒 Data Protection
- **Encryption at Rest**: Encrypt sensitive data stored on device
- **Encryption in Transit**: Use strong encryption for data transmission
- **Data Minimization**: Only collect and store necessary data
- **Secure Deletion**: Properly delete sensitive data when no longer needed

#### 🏗️ Application Architecture
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Defense in Depth**: Implement multiple layers of security controls
- **Secure Defaults**: Use secure configurations by default
- **Regular Security Testing**: Conduct regular security assessments and penetration testing

## Security Architecture

### Cryptographic Implementation

React Native Nitro TOTP implements industry-standard cryptographic practices:

- **HMAC Algorithms**: Supports HMAC-SHA1, HMAC-SHA256, and HMAC-SHA512
- **Time-based Generation**: RFC 6238 compliant TOTP implementation
- **Counter-based Generation**: RFC 4226 compliant HOTP implementation
- **Base32 Encoding**: Secure Base32 encoding/decoding for secrets
- **Memory Protection**: Secure memory handling to prevent data leakage

### Security Assumptions

This library assumes:
- The device's secure storage (Keychain/Keystore) is not compromised
- The application using this library implements proper security measures
- The device time is reasonably synchronized
- The secret sharing process (QR codes, manual entry) is conducted securely

## Threat Model

### In Scope
- Cryptographic implementation vulnerabilities
- Secret handling and storage issues
- Time synchronization problems
- Memory leakage of sensitive data
- Input validation bypass
- Authentication bypass vulnerabilities

### Out of Scope
- Compromised device or operating system
- Social engineering attacks
- Physical device access attacks
- Network-level attacks (unless related to our implementation)
- Third-party service vulnerabilities

## Security Updates

### Notification Channels
- **GitHub Security Advisories**: Critical vulnerabilities will be published as GitHub Security Advisories
- **Release Notes**: Security fixes will be highlighted in release notes
- **npm Security Advisories**: Vulnerabilities will be reported to npm for automated scanning

### Update Process
1. **Immediate**: Critical vulnerabilities affecting authentication bypass or secret exposure
2. **Priority**: High-severity vulnerabilities within 7 days
3. **Standard**: Medium/Low severity vulnerabilities in next scheduled release

## Security Testing

We employ multiple security testing approaches:

- **Static Analysis**: Automated code analysis for common vulnerabilities
- **Dependency Scanning**: Regular scanning of dependencies for known vulnerabilities
- **Cryptographic Review**: Regular review of cryptographic implementations
- **Manual Testing**: Security-focused manual testing of critical paths

## Compliance and Standards

This library follows:
- **RFC 6238**: Time-Based One-Time Password Algorithm
- **RFC 4226**: HMAC-Based One-Time Password Algorithm
- **OWASP Mobile Top 10**: Mobile application security best practices
- **Common Weakness Enumeration (CWE)**: Industry-standard vulnerability classification

## Contact and Support

### Security Team
For security-related inquiries, contact our security team at:
- **Email**: [hello@ryamjs.dev](mailto:hello@ryamjs.dev)
- **Subject**: `[SECURITY] Your Security Question`

### Community Support
For general questions and community support:
- **GitHub Issues**: For bug reports and feature requests (non-security)
- **GitHub Discussions**: For community discussions and questions

## Acknowledgments

We thank the security research community for their contributions to making this library more secure. Security researchers who have contributed to the security of this project are recognized in our [Hall of Fame](https://github.com/4cc3ssX/react-native-nitro-totp/security/advisories).

---

**Last Updated**: September 2025

Thank you for helping us keep React Native Nitro TOTP secure for everyone! 🔐
