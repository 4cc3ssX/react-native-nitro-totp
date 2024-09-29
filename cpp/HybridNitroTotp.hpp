#pragma once

#include "HybridNitroTotpSpec.hpp"
#include <string>

namespace margelo::nitro::totp {

class HybridNitroTotp : public HybridNitroTotpSpec {
  public:
    HybridNitroTotp() : HybridObject(TAG) {}

  public:
    // Generates an OTP based on the secret key and options
    std::string
    generate(const std::string &secret,
             const std::optional<NitroTotpGenerateOptions> &options) override;

    // Validates the OTP based on the secret key and options
    bool validate(const std::string &secret, const std::string &otp,
                  const std::optional<NitroTotpValidateOptions> &options) override;

    // Generates an OTP Auth URL
    std::string
    generateAuthURL(const OTPAuthURLOptions &options) override;

    void loadHybridMethods() override {
        // call base protoype
        HybridNitroTotpSpec::loadHybridMethods();
    }
};
} // namespace margelo::nitro::totp
