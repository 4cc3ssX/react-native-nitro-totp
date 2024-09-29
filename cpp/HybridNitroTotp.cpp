#include "HybridNitroTotp.hpp"
#include "BaseOptions.hpp"
#include "Hmac.hpp"
#include "HybridNitroHotp.hpp"
#include "Secret.hpp"
#include "Utils.hpp"
#include <chrono>
#include <iomanip>
#include <random>
#include <sstream>
#include <stdexcept>

namespace margelo::nitro::totp {

// Generates an OTP
std::string HybridNitroTotp::generate(
    const std::string &secret,
    const std::optional<NitroTotpGenerateOptions> &options) {
    // Set default values
    int period = BaseGenerationOptions::period;
    int digits = BaseGenerationOptions::digits;
    SupportedAlgorithm algorithm = BaseGenerationOptions::algorithm;
    uint64_t currentTime = static_cast<uint64_t>(
        std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::system_clock::now().time_since_epoch())
            .count());

    // Override defaults with options if provided
    if (options.has_value()) {
        const NitroTotpGenerateOptions &providedOpts = options.value();

        if (providedOpts.period.has_value()) {
            period = providedOpts.period.value();
        }

        if (providedOpts.digits.has_value()) {
            digits = providedOpts.digits.value();
        }

        if (providedOpts.algorithm.has_value()) {
            algorithm = providedOpts.algorithm.value();
        }
    }

    // Compute time-based counter
    uint64_t counter = static_cast<uint64_t>(currentTime) / period;

    // Prepare options for HOTP generate function
    NitroHOTPGenerateOptions generateOptions(counter, digits, algorithm);

    HybridNitroHotp hybridNitroHotp;

    // Call the HOTP generate function with the secret and updated options
    return hybridNitroHotp.generate(secret, generateOptions);
}

// Validates the OTP
bool HybridNitroTotp::validate(
    const std::string &secret, const std::string &otp,
    const std::optional<NitroTotpValidateOptions> &options) {

    // Default values
    int period = BaseGenerationOptions::period;
    int digits = BaseGenerationOptions::digits;
    SupportedAlgorithm algorithm = BaseGenerationOptions::algorithm;
    int window = BaseValidationOptions::window;
    uint64_t currentTime = static_cast<uint64_t>(
        std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::system_clock::now().time_since_epoch())
            .count());

    // Override defaults with options if provided
    if (options.has_value()) {
        const NitroTotpValidateOptions &providedOpts = options.value();

        if (providedOpts.period.has_value()) {
            period = providedOpts.period.value();
        }

        if (providedOpts.digits.has_value()) {
            digits = providedOpts.digits.value();
        }

        if (providedOpts.algorithm.has_value()) {
            algorithm = providedOpts.algorithm.value();
        }

        if (providedOpts.window.has_value()) {
            window = providedOpts.window.value();
        }
    }

    // Compute time-based counter
    uint64_t counter = static_cast<uint64_t>(currentTime) / period;

    // Set the counter in hotpOptions
    // Prepare options for HOTP validate function
    NitroHOTPValidateOptions validateOptions(counter, window, digits,
                                             algorithm);

    HybridNitroHotp hybridNitroHotp;
    return hybridNitroHotp.validate(secret, otp, validateOptions);
}

std::string HybridNitroTotp::generateAuthURL(const OTPAuthURLOptions &options) {
    std::ostringstream url;
    url << "otpauth://totp/";
    std::string label = BaseOTPAuthURLOptions::label;
    std::string issuer = BaseOTPAuthURLOptions::issuer;
    bool issuerInLabel = BaseOTPAuthURLOptions::issuerInLabel;
    std::string algorithm =
        Utils::getAlgorithmName(BaseGenerationOptions::algorithm);
    int digits = BaseGenerationOptions::digits;
    int period = BaseGenerationOptions::period;

    if (options.secret.empty()) {
        const std::string message = "Secret is required.";
        Logger::nativeLog(LogLevel::Error, "HybridNitroTotp:generateAuthURL", message);
        throw std::runtime_error(message);
    }

    std::string secret = options.secret;

    if (options.label.has_value()) {
        label = options.label.value();
    }

    if (options.issuer.has_value()) {
        issuer = options.issuer.value();
    }

    if (options.issuerInLabel.has_value()) {
        issuerInLabel = options.issuerInLabel.value();
    }

    if (options.period.has_value()) {
        period = static_cast<int>(options.period.value());
    }
    if (options.digits.has_value()) {
        digits = static_cast<int>(options.digits.value());
    }
    if (options.algorithm.has_value()) {
        algorithm = Utils::getAlgorithmName(options.algorithm.value());
    }

    if (!issuer.empty()) {
        if (issuerInLabel) {
            url << Utils::encodeURIComponent(issuer) << ":"
                << Utils::encodeURIComponent(label)
                << "?issuer=" << Utils::encodeURIComponent(issuer) << "&";
        } else {
            url << Utils::encodeURIComponent(label)
                << "?issuer=" << Utils::encodeURIComponent(issuer) << "&";
        }
    } else {
        url << Utils::encodeURIComponent(label) << "?";
    }

    // Add secret, algorithm, digits, and counter
    url << "secret=" << Utils::encodeURIComponent(secret) << "&";
    url << "algorithm=" << Utils::encodeURIComponent(algorithm) << "&";
    url << "digits=" << digits << "&";
    url << "period=" << period;

    return url.str();
}

} // namespace margelo::nitro::totp
