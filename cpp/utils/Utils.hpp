#pragma once

#include "HybridNitroTotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {
class Utils {
public:
  static std::string formatOtp(uint32_t otp, int digits);
  static std::string getAlgorithmName(SupportedAlgorithm algorithm);
};
} // namespace margelo::nitro::totp
