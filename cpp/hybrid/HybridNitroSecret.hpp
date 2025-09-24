#pragma once

#include "HybridNitroSecretSpec.hpp"

namespace margelo::nitro::totp {

class HybridNitroSecret : public HybridNitroSecretSpec {
public:
  HybridNitroSecret() : HybridObject(TAG) {}

public:
  std::string generate(const GenerateSecretKeyOptions &options) override;

  void loadHybridMethods() override {
    // call base protoype
    HybridNitroSecretSpec::loadHybridMethods();
  }
};
} // namespace margelo::nitro::totp
