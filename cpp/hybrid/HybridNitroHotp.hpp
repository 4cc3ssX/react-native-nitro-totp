#pragma once

#include "HybridNitroHotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

class HybridNitroHotp : public HybridNitroHOTPSpec {
  public:
    HybridNitroHotp() : HybridObject(TAG) {}

  public:
    // Generates an OTP based on the secret key and options
    std::string
    generate(const std::string &secret,
             const std::optional<NitroHOTPGenerateOptions> &options) override;

    // Validates the OTP based on the secret key and options
    bool validate(const std::string &secret, const std::string &otp,
                  const std::optional<NitroHOTPValidateOptions> &options) override;

    void loadHybridMethods() override {
        // call base protoype
        HybridNitroHOTPSpec::loadHybridMethods();
    }
};
} // namespace margelo::nitro::totp
