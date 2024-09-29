#include "Base32.hpp"
#include <cctype>

namespace Base32 {

// Base32 encoding table
static const std::string base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// Base32 lookup table for decoding
static int base32Lookup[256] = {-1};

void initializeBase32Lookup() {
    static bool initialized = false;
    if (initialized)
        return;
    initialized = true;

    // Map valid Base32 characters to their values
    for (int i = 0; i < 32; ++i) {
        unsigned char upper = static_cast<unsigned char>(base32Chars[i]);
        unsigned char lower =
            static_cast<unsigned char>(std::tolower(base32Chars[i]));
        base32Lookup[upper] = i;
        base32Lookup[lower] = i;
    }
}

// Implement the encode function
std::string encode(const std::vector<uint8_t> &data) {
    std::string result;

    int index = 0;
    int currByte, nextByte;
    int digit;

    size_t i = 0;
    while (i < data.size()) {
        currByte = data[i];

        if (index > 3) {
            if ((i + 1) < data.size()) {
                nextByte = data[i + 1];
            } else {
                nextByte = 0;
            }

            digit = ((currByte & (0xFF >> index)) << (index - 3)) |
                    (nextByte >> (8 - (index - 3)));
            index = (index + 5) % 8;
            i++;
        } else {
            digit = (currByte >> (8 - (index + 5))) & 0x1F;
            index = (index + 5) % 8;
            if (index == 0) {
                i++;
            }
        }

        result += base32Chars[digit];
    }

    // Add padding
    while (result.size() % 8 != 0) {
        result += '=';
    }

    return result;
}

// Implement the decode function
std::vector<uint8_t> decode(const std::string &base32String) {
    initializeBase32Lookup();

    std::vector<uint8_t> result;

    int buffer = 0;
    int bitsLeft = 0;
    for (char c : base32String) {
        if (c == '=' || c == '\0')
            break;
        int val = base32Lookup[static_cast<unsigned char>(toupper(c))];
        if (val == -1)
            continue;
        buffer <<= 5;
        buffer |= val & 0x1F;
        bitsLeft += 5;
        if (bitsLeft >= 8) {
            result.push_back(
                static_cast<uint8_t>((buffer >> (bitsLeft - 8)) & 0xFF));
            bitsLeft -= 8;
        }
    }

    return result;
}

std::string clean(const std::string &input) {
    std::string output;
    output.reserve(input.size());

    for (char ch : input) {
        // Convert character to uppercase safely
        unsigned char uchar = static_cast<unsigned char>(ch);
        char upperCh = static_cast<char>(std::toupper(uchar));

        // Check if the character is a valid Base32 character
        if (base32Chars.find(upperCh) != std::string::npos) {
            output.push_back(upperCh);
        }
        // Ignore padding characters '=' and any invalid characters
    }

    return output;
}

} // namespace Base32
