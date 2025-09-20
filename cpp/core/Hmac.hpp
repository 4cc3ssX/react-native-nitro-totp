#pragma once

#include <string>
#include <vector>

namespace HMAC {

std::vector<uint8_t> compute(const std::string &algorithm,
                             const std::vector<uint8_t> &key,
                             const std::vector<uint8_t> &data);

} // namespace HMAC
