#include "Secret.hpp"
#include "Base32.hpp"
#include <algorithm>
#include <random>
#include <stdexcept>
#include <openssl/rand.h>

std::vector<uint8_t> Secret::generateRandomBytes(size_t size) {
  std::vector<uint8_t> randomBytes(size);
  if (RAND_bytes(randomBytes.data(), static_cast<int>(size)) != 1) {
    throw std::runtime_error("Failed to generate secure random bytes");
  }

  return randomBytes;
}

Secret::Secret(const std::vector<uint8_t> &buffer, size_t size) {
  if (buffer.empty()) {
    bytes = generateRandomBytes(size);
  } else {
    bytes = buffer;
  }
}

Secret Secret::fromLatin1(const std::string &str) {
  return Secret(latin1Decode(str));
}

Secret Secret::fromUTF8(const std::string &str) {
  return Secret(utf8Decode(str));
}

Secret Secret::fromBase32(const std::string &str) {
  return Secret(base32Decode(str));
}

Secret Secret::fromHex(const std::string &str) {
  return Secret(hexDecode(str));
}

std::string Secret::getLatin1() const { return latin1Encode(bytes); }

std::string Secret::getUTF8() const { return utf8Encode(bytes); }

std::string Secret::getBase32() const { return base32Encode(bytes); }

std::string Secret::getHex() const { return hexEncode(bytes); }

const std::vector<uint8_t> &Secret::getBytes() const { return bytes; }

std::vector<uint8_t> Secret::latin1Decode(const std::string &str) {
  return std::vector<uint8_t>(str.begin(), str.end());
}

std::vector<uint8_t> Secret::utf8Decode(const std::string &str) {
  return std::vector<uint8_t>(str.begin(), str.end());
}

std::vector<uint8_t> Secret::base32Decode(const std::string &str) {
  return Base32::decode(str);
}

std::vector<uint8_t> Secret::hexDecode(const std::string &str) {
  std::vector<uint8_t> result;
  for (size_t i = 0; i < str.size(); i += 2) {
    std::string byte = str.substr(i, 2);
    result.push_back(static_cast<uint8_t>(std::stoi(byte, nullptr, 16)));
  }
  return result;
}

std::string Secret::latin1Encode(const std::vector<uint8_t> &bytes) {
  return std::string(bytes.begin(), bytes.end());
}

std::string Secret::utf8Encode(const std::vector<uint8_t> &bytes) {
  return std::string(bytes.begin(), bytes.end());
}

std::string Secret::base32Encode(const std::vector<uint8_t> &bytes) {
  return Base32::encode(bytes);
}

std::string Secret::hexEncode(const std::vector<uint8_t> &bytes) {
  static const char *const lut = "0123456789ABCDEF";
  size_t len = bytes.size();
  std::string result;
  result.reserve(2 * len);
  for (size_t i = 0; i < len; ++i) {
    const unsigned char c = bytes[i];
    result.push_back(lut[c >> 4]);
    result.push_back(lut[c & 15]);
  }
  return result;
}
