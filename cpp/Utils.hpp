#pragma once

#include "HybridNitroTotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {
class Utils {
  public:
    static uint64_t getTimeCounter(time_t currentTime, int timeStep);
    static std::string formatOtp(uint32_t otp, int digits);
    static std::string getAlgorithmName(SupportedAlgorithm algorithm);
    static std::string encodeURIComponent(const std::string &str);
};
} // namespace margelo::nitro::totp
