#include "HybridNitroHotp.hpp"
#include "../utils/BaseOptions.hpp"
#include "../core/Hmac.hpp"
#include "../core/Secret.hpp"
#include "../utils/Utils.hpp"
#include <iomanip>
#include <random>
#include <sstream>
#include <stdexcept>

namespace margelo::nitro::totp {

// Generates an OTP
std::string HybridNitroHotp::generate(
    const std::string &secret,
    const std::optional<NitroHOTPGenerateOptions> &options) {
    // Set default values
    int digits = BaseGenerationOptions::digits;
    std::string algorithm =
        Utils::getAlgorithmName(BaseGenerationOptions::algorithm);
    uint64_t counter = BaseGenerationOptions::counter;

    // Override defaults with options if provided
    if (options.has_value()) {
        const NitroHOTPGenerateOptions &opts = options.value();

        if (opts.digits.has_value()) {
            digits = opts.digits.value();
        }

        if (opts.algorithm.has_value()) {
            algorithm = Utils::getAlgorithmName(opts.algorithm.value());
        }

        if (opts.counter.has_value()) {
            counter = opts.counter.value();
        }
    }

    // Decode the secret
    std::vector<uint8_t> key = Secret::fromBase32(secret).getBytes();

    // Convert counter to byte array (big-endian)
    uint8_t data[8];
    uint64_t counterCopy = counter;
    for (int i = 7; i >= 0; --i) {
        data[i] = static_cast<uint8_t>(counterCopy & 0xFF);
        counterCopy >>= 8;
    }

    // Compute HMAC
    std::vector<uint8_t> hmacResult =
        HMAC::compute(algorithm, key, std::vector<uint8_t>(data, data + 8));

    // Dynamic truncation
    int offset = hmacResult[hmacResult.size() - 1] & 0x0F;
    uint32_t binaryCode = ((hmacResult[offset] & 0x7F) << 24) |
                          ((hmacResult[offset + 1] & 0xFF) << 16) |
                          ((hmacResult[offset + 2] & 0xFF) << 8) |
                          (hmacResult[offset + 3] & 0xFF);

    uint32_t otp = binaryCode % static_cast<uint32_t>(std::pow(10, digits));

    // Format OTP with leading zeros
    return Utils::formatOtp(otp, digits);
}

// Validates the OTP
bool HybridNitroHotp::validate(
    const std::string &secret, const std::string &otp,
    const std::optional<NitroHOTPValidateOptions> &options) {

    // Default values
    int digits = BaseGenerationOptions::digits;
    SupportedAlgorithm algorithm = BaseGenerationOptions::algorithm;
    uint64_t counter = BaseGenerationOptions::counter;
    int window = BaseValidationOptions::window;

    // Override defaults with options if provided
    if (options.has_value()) {
        const NitroHOTPValidateOptions &opts = options.value();
        if (opts.digits.has_value()) {
            digits = opts.digits.value();
        }
        if (opts.algorithm.has_value()) {
            algorithm = opts.algorithm.value();
        }
        if (opts.counter.has_value()) {
            counter = opts.counter.value();
        }
        if (opts.window.has_value()) {
            window = opts.window.value();
        }
    }

    for (int i = -window; i <= window; ++i) {
        uint64_t testCounter = counter + i;

        // Create GenerateOptions
        NitroHOTPGenerateOptions generationOptions(counter, digits, algorithm);

        // Generate OTP for the test counter
        std::string generatedOtp = generate(secret, generationOptions);

        if (generatedOtp == otp) {
            return true;
        }
    }

    return false;
}

} // namespace margelo::nitro::totp
