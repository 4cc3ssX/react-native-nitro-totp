#include "Utils.hpp"
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace margelo::nitro::totp {

// Helper method to format OTP with leading zeros
std::string Utils::formatOtp(uint32_t otp, int digits) {
  std::ostringstream ss;
  ss << std::setw(digits) << std::setfill('0') << otp;
  return ss.str();
}

// Helper method to get supported algorithm name
std::string Utils::getAlgorithmName(SupportedAlgorithm algorithm) {
  switch (algorithm) {
  case SupportedAlgorithm::SHA1:
    return "SHA1";
  case SupportedAlgorithm::SHA256:
    return "SHA256";
  case SupportedAlgorithm::SHA512:
    return "SHA512";
  default:
    throw std::runtime_error("Unsupported algorithm");
  }
}

} // namespace margelo::nitro::totp
