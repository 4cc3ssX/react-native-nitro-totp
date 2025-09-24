#pragma once

#include "HybridNitroTotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

// Define the base options for secret key
struct BaseSecretKeyOptions {
public:
  static int size;
};

} // namespace margelo::nitro::totp
