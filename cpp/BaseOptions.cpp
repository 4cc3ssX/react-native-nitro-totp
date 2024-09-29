#include "BaseOptions.hpp"

namespace margelo::nitro::totp {

// Initialize static members of BaseOTPAuthURLOptions
std::string BaseOTPAuthURLOptions::issuer = "";
std::string BaseOTPAuthURLOptions::label = "OTPAuth";
bool BaseOTPAuthURLOptions::issuerInLabel = false;

// Initialize static members of BaseSecretKeyOptions
int BaseSecretKeyOptions::length = 12;

// Initialize static members of BaseGenerationOptions
int BaseGenerationOptions::period = 30;
int BaseGenerationOptions::digits = 6;
SupportedAlgorithm BaseGenerationOptions::algorithm = SupportedAlgorithm::SHA1;
int BaseGenerationOptions::counter = 0;

// Initialize static members of BaseValidationOptions
int BaseValidationOptions::window = 1;

} // namespace margelo::nitro::totp
