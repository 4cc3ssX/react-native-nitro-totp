#include "HybridNitroTotp.hpp"
#include "../core/Hmac.hpp"
#include "../core/Secret.hpp"
#include "../utils/BaseOptions.hpp"
#include "../utils/Utils.hpp"
#include "HybridNitroHotp.hpp"
#include <stdexcept>

namespace margelo::nitro::totp {

// Generates an OTP
std::string HybridNitroTotp::generate(const std::string &secret,
                                      const NitroTotpGenerateOptions &options) {
  int period = options.period.value();
  int digits = options.digits.value();
  SupportedAlgorithm algorithm = options.algorithm.value();
  uint64_t currentTime = static_cast<uint64_t>(options.currentTime.value());

  // Compute time-based counter
  uint64_t counter = static_cast<uint64_t>(currentTime) / period;

  // Prepare options for HOTP generate function
  NitroHOTPGenerateOptions generateOptions(counter, digits, algorithm);

  HybridNitroHotp hybridNitroHotp;

  // Call the HOTP generate function with the secret and updated options
  return hybridNitroHotp.generate(secret, generateOptions);
}

// Validates the OTP
bool HybridNitroTotp::validate(const std::string &secret,
                               const std::string &otp,
                               const NitroTotpValidateOptions &options) {

  // Default values
  int period = options.period.value();
  int digits = options.digits.value();
  SupportedAlgorithm algorithm = options.algorithm.value();
  int window = options.window.value();
  uint64_t currentTime = static_cast<uint64_t>(options.currentTime.value());

  // Compute time-based counter
  uint64_t counter = static_cast<uint64_t>(currentTime) / period;

  // Set the counter in hotpOptions
  // Prepare options for HOTP validate function
  NitroHOTPValidateOptions validateOptions(counter, window, digits, algorithm);

  HybridNitroHotp hybridNitroHotp;
  return hybridNitroHotp.validate(secret, otp, validateOptions);
}

} // namespace margelo::nitro::totp
