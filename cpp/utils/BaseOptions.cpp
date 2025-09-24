#include "BaseOptions.hpp"

namespace margelo::nitro::totp {

// Initialize static members of BaseSecretKeyOptions
int BaseSecretKeyOptions::size = 20; // 20 bytes = 32 Base32 characters (industry standard)

} // namespace margelo::nitro::totp
