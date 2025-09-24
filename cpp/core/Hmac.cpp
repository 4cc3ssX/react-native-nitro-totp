#include "Hmac.hpp"
#include <cstring>
#include <openssl/core_names.h>
#include <openssl/evp.h>
#include <stdexcept>

namespace HMAC {

std::vector<uint8_t> compute(const std::string &algorithm,
                             const std::vector<uint8_t> &key,
                             const std::vector<uint8_t> &data) {
  EVP_MAC *mac = nullptr;
  EVP_MAC_CTX *ctx = nullptr;
  OSSL_PARAM params[2];
  size_t params_n = 0;
  const char *mac_name = "HMAC";
  const char *digest_name = nullptr;

  // Map algorithm to digest name
  if (algorithm == "SHA1") {
    digest_name = "SHA1";
  } else if (algorithm == "SHA256") {
    digest_name = "SHA256";
  } else if (algorithm == "SHA512") {
    digest_name = "SHA512";
  } else {
    throw std::runtime_error("Unsupported algorithm");
  }

  mac = EVP_MAC_fetch(nullptr, mac_name, nullptr);
  if (!mac) {
    throw std::runtime_error("Failed to fetch HMAC");
  }

  // Create MAC context
  ctx = EVP_MAC_CTX_new(mac);
  EVP_MAC_free(mac);
  if (!ctx) {
    throw std::runtime_error("Failed to create HMAC context");
  }

  // Set up parameters
  params[params_n++] = OSSL_PARAM_construct_utf8_string(
      OSSL_MAC_PARAM_DIGEST, const_cast<char *>(digest_name), 0);
  params[params_n] = OSSL_PARAM_construct_end();

  // Initialize MAC context
  if (EVP_MAC_init(ctx, key.data(), key.size(), params) != 1) {
    EVP_MAC_CTX_free(ctx);
    throw std::runtime_error("Failed to initialize HMAC");
  }

  // Update MAC context with data
  if (EVP_MAC_update(ctx, data.data(), data.size()) != 1) {
    EVP_MAC_CTX_free(ctx);
    throw std::runtime_error("Failed to update HMAC");
  }

  // Finalize MAC and get the output size
  size_t out_len = 0;
  if (EVP_MAC_final(ctx, nullptr, &out_len, 0) != 1) {
    EVP_MAC_CTX_free(ctx);
    throw std::runtime_error("Failed to finalize HMAC");
  }

  // Get the MAC output
  std::vector<uint8_t> hmacResult(out_len);
  if (EVP_MAC_final(ctx, hmacResult.data(), &out_len, hmacResult.size()) != 1) {
    EVP_MAC_CTX_free(ctx);
    throw std::runtime_error("Failed to get HMAC result");
  }

  EVP_MAC_CTX_free(ctx);
  hmacResult.resize(out_len);
  return hmacResult;
}

} // namespace HMAC
