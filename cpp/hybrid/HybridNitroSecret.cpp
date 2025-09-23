#include "HybridNitroSecret.hpp"
#include "../core/Base32.hpp"
#include "../utils/BaseOptions.hpp"
#include "../core/Secret.hpp"
#include <limits>

namespace margelo::nitro::totp {
// Generates a random secret key
std::string
HybridNitroSecret::generate(const GenerateSecretKeyOptions &options) {
  int keySize = BaseSecretKeyOptions::length;

  double length = options.length.value();
  if (length > static_cast<double>(std::numeric_limits<int>::max()) ||
      length < 0.0) {
    throw std::runtime_error("Invalid length value");
  }

  keySize = static_cast<int>(length);

  Secret secret(std::vector<uint8_t>(), keySize);

  const std::string cleanedSecretKey = Base32::clean(secret.getBase32());

  return cleanedSecretKey;
}
} // namespace margelo::nitro::totp
