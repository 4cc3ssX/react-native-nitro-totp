#include "HybridNitroHotp.hpp"
#include "../core/Hmac.hpp"
#include "../core/Secret.hpp"
#include "../utils/BaseOptions.hpp"
#include "../utils/Utils.hpp"
#include <cmath>
#include <stdexcept>

namespace margelo::nitro::totp {

std::string HybridNitroHotp::generate(const std::string &secret,
                                      const NitroHotpGenerateOptions &options) {
  int digits = options.digits.value();
  std::string algorithm = Utils::getAlgorithmName(options.algorithm.value());
  uint64_t counter = options.counter.value();

  std::vector<uint8_t> key = Secret::fromBase32(secret).getBytes();

  uint8_t data[8];
  uint64_t counterCopy = counter;
  for (int i = 7; i >= 0; --i) {
    data[i] = static_cast<uint8_t>(counterCopy & 0xFF);
    counterCopy >>= 8;
  }

  std::vector<uint8_t> hmacResult =
      HMAC::compute(algorithm, key, std::vector<uint8_t>(data, data + 8));

  int offset = hmacResult[hmacResult.size() - 1] & 0x0F;
  uint32_t binaryCode = ((hmacResult[offset] & 0x7F) << 24) |
                        ((hmacResult[offset + 1] & 0xFF) << 16) |
                        ((hmacResult[offset + 2] & 0xFF) << 8) |
                        (hmacResult[offset + 3] & 0xFF);

  uint32_t otp = binaryCode % static_cast<uint32_t>(std::pow(10, digits));

  return Utils::formatOtp(otp, digits);
}

bool HybridNitroHotp::validate(const std::string &secret,
                               const std::string &otp,
                               const NitroHotpValidateOptions &options) {

  // Default values
  int digits = options.digits.value();
  SupportedAlgorithm algorithm = options.algorithm.value();
  uint64_t counter = options.counter.value();
  int window = options.window.value();

  for (int i = -window; i <= window; ++i) {
    uint64_t testCounter = counter + i;

    NitroHotpGenerateOptions generationOptions(testCounter, digits, algorithm);

    std::string generatedOtp = generate(secret, generationOptions);

    if (generatedOtp == otp) {
      return true;
    }
  }

  return false;
}

} // namespace margelo::nitro::totp
