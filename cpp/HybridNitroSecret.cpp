#include "HybridNitroSecret.hpp"
#include "Base32.hpp"
#include "BaseOptions.hpp"
#include "Secret.hpp"

namespace margelo::nitro::totp {
// Generates a random secret key
std::string HybridNitroSecret::generate(
    const std::optional<GenerateSecretKeyOptions> &options) {
    int keySize = BaseSecretKeyOptions::length; // Default key size in bytes

    if (options.has_value()) {
        const GenerateSecretKeyOptions &opts = options.value();

        // Handle length
        if (opts.length.has_value()) {
            double length = opts.length.value();
            if (length > static_cast<double>(std::numeric_limits<int>::max()) ||
                length < 0.0) {
                throw std::runtime_error("Invalid length value");
            }
            keySize = static_cast<int>(length);
        }
    }

    Secret secret(std::vector<uint8_t>(), keySize);

    const std::string cleanedSecretKey = Base32::clean(secret.getBase32());

    return cleanedSecretKey;
}
} // namespace margelo::nitro::totp
