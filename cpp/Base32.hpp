#pragma once

#include <string>
#include <vector>

namespace Base32 {

std::string encode(const std::vector<uint8_t> &data);
std::vector<uint8_t> decode(const std::string &base32String);
std::string clean(const std::string &input);

} // namespace Base32
