#pragma once

#include "HybridNitroSecretSpec.hpp"

namespace margelo::nitro::totp {

class HybridNitroSecret : public HybridNitroSecretSpec {
  public:
    HybridNitroSecret() : HybridObject(TAG) {}

  public:
    // Generates secret key based on options
    std::string
    generate(const std::optional<GenerateSecretKeyOptions> &options) override;

    void loadHybridMethods() override {
        // call base protoype
        HybridNitroSecretSpec::loadHybridMethods();
    }
};
} // namespace margelo::nitro::totp
