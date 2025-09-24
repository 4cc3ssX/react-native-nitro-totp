#pragma once

#include <string>
#include <vector>

class Secret {
public:
  // Constructor to create a Secret object from a buffer or generate random
  // bytes.
  Secret(const std::vector<uint8_t> &buffer = std::vector<uint8_t>(),
         size_t size = 20);

  static Secret fromLatin1(const std::string &str);
  static Secret fromUTF8(const std::string &str);
  static Secret fromBase32(const std::string &str);
  static Secret fromHex(const std::string &str);

  std::string getLatin1() const;
  std::string getUTF8() const;
  std::string getBase32() const;
  std::string getHex() const;

  const std::vector<uint8_t> &getBytes() const;

  // Static method to generate random bytes.
  static std::vector<uint8_t> generateRandomBytes(size_t size);

private:
  // Secret key bytes.
  std::vector<uint8_t> bytes;
  static std::vector<uint8_t> latin1Decode(const std::string &str);
  static std::vector<uint8_t> utf8Decode(const std::string &str);
  static std::vector<uint8_t> base32Decode(const std::string &str);
  static std::vector<uint8_t> hexDecode(const std::string &str);

  static std::string latin1Encode(const std::vector<uint8_t> &bytes);
  static std::string utf8Encode(const std::vector<uint8_t> &bytes);
  static std::string base32Encode(const std::vector<uint8_t> &bytes);
  static std::string hexEncode(const std::vector<uint8_t> &bytes);
};
