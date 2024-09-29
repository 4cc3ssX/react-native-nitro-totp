#pragma once

#import "HybridNitroTotp.hpp"
#include <string>

namespace margelo::nitro::totp {
// Define the base options for OTP Auth URL
struct BaseOTPAuthURLOptions {
  public:
    static std::string issuer;
    static std::string label;
    static bool issuerInLabel;
};

// Define the base options for secret key
struct BaseSecretKeyOptions {
  public:
    static int length;
};

// Define the base options for generation
struct BaseGenerationOptions {
  public:
    static int period;
    static int digits;
    static SupportedAlgorithm algorithm;
    static int counter;
};

// Define the base options for validation
struct BaseValidationOptions {
  public:
    static int window;
};

} // namespace margelo::nitro::totp
