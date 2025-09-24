#pragma once

#include "HybridNitroTotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

class HybridNitroTotp : public HybridNitroTotpSpec {
public:
  HybridNitroTotp() : HybridObject(TAG) {}

public:
  std::string generate(const std::string &secret,
                       const NitroTotpGenerateOptions &options) override;

  bool validate(const std::string &secret, const std::string &otp,
                const NitroTotpValidateOptions &options) override;

  void loadHybridMethods() override {
    // call base protoype
    HybridNitroTotpSpec::loadHybridMethods();
  }
};
} // namespace margelo::nitro::totp
