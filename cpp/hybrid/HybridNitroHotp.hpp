#pragma once

#include "HybridNitroHotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

class HybridNitroHotp : public HybridNitroHOTPSpec {
public:
  HybridNitroHotp() : HybridObject(TAG) {}

public:
  std::string generate(const std::string &secret,
                       const NitroHOTPGenerateOptions &options) override;

  bool validate(const std::string &secret, const std::string &otp,
                const NitroHOTPValidateOptions &options) override;

  void loadHybridMethods() override {
    // call base protoype
    HybridNitroHOTPSpec::loadHybridMethods();
  }
};
} // namespace margelo::nitro::totp
