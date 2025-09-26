#pragma once

#include "HybridNitroHotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

class HybridNitroHotp : public HybridNitroHotpSpec {
public:
  HybridNitroHotp() : HybridObject(TAG) {}

public:
  std::string generate(const std::string &secret,
                       const NitroHotpGenerateOptions &options) override;

  bool validate(const std::string &secret, const std::string &otp,
                const NitroHotpValidateOptions &options) override;

  void loadHybridMethods() override {
    // call base protoype
    HybridNitroHotpSpec::loadHybridMethods();
  }
};
} // namespace margelo::nitro::totp
