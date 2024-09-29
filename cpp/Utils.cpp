#import "Utils.hpp"
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>

namespace margelo::nitro::totp {
// Helper method to compute time counter
uint64_t Utils::getTimeCounter(time_t currentTime, int timeStep) {
    return static_cast<uint64_t>(currentTime) / timeStep;
}

// Helper method to format OTP with leading zeros
std::string Utils::formatOtp(uint32_t otp, int digits) {
    std::ostringstream ss;
    ss << std::setw(digits) << std::setfill('0') << otp;
    return ss.str();
}

// Helper method to get supported algorithm name
std::string Utils::getAlgorithmName(SupportedAlgorithm algorithm) {
    switch (algorithm) {
    case SupportedAlgorithm::SHA1:
        return "SHA1";
    case SupportedAlgorithm::SHA256:
        return "SHA256";
    case SupportedAlgorithm::SHA512:
        return "SHA512";
    default:
        throw std::runtime_error("Unsupported algorithm");
    }
}

// Encodes a string to URL encoding
std::string Utils::encodeURIComponent(const std::string &str) {
    std::ostringstream encoded;
    encoded.fill('0');
    encoded << std::hex;
    for (char c : str) {
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded << c;
        } else {
            encoded << std::uppercase;
            encoded << '%' << std::setw(2) << int((unsigned char)c);
            encoded << std::nouppercase;
        }
    }
    return encoded.str();
}
} // namespace margelo::nitro::totp
