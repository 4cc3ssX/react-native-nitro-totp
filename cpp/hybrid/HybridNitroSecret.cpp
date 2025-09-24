#include "HybridNitroSecret.hpp"
#include "../core/Base32.hpp"
#include "../utils/BaseOptions.hpp"
#include "../core/Secret.hpp"
#include <limits>
#include <cmath>

namespace margelo::nitro::totp {
std::string
HybridNitroSecret::generate(const GenerateSecretKeyOptions &options) {
  int keySize = BaseSecretKeyOptions::size;

  double size = options.size.value();

  if (size < 0.0 || size != std::floor(size)) {
    throw std::runtime_error("Secret size must be a positive integer");
  }

  // Convert enum values to actual byte sizes
  // 0 = COMPACT (16 bytes), 1 = STANDARD (20 bytes), 2 = EXTENDED (32 bytes)
  if (size == 0.0) {
    keySize = 16; // COMPACT
  } else if (size == 1.0) {
    keySize = 20; // STANDARD
  } else if (size == 2.0) {
    keySize = 32; // EXTENDED
  } else {
    // Allow direct byte values for backward compatibility
    if (size != 16.0 && size != 20.0 && size != 32.0) {
      throw std::runtime_error("Secret size must be 16, 20, or 32 bytes (or use enum values 0, 1, 2)");
    }
    keySize = static_cast<int>(size);
  }  if (size > 0.0) {
    keySize = static_cast<int>(size);
  }

  Secret secret(std::vector<uint8_t>(), keySize);

  const std::string cleanedSecretKey = Base32::clean(secret.getBase32());

  return cleanedSecretKey;
}
} // namespace margelo::nitro::totp
