///
/// SupportedAlgorithm.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2024 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/NitroHash.hpp>)
#include <NitroModules/NitroHash.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
#if __has_include(<NitroModules/JSIConverter.hpp>)
#include <NitroModules/JSIConverter.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
#if __has_include(<NitroModules/NitroDefines.hpp>)
#include <NitroModules/NitroDefines.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

namespace margelo::nitro::totp {

  /**
   * An enum which can be represented as a JavaScript union (SupportedAlgorithm).
   */
  enum class SupportedAlgorithm {
    SHA1      SWIFT_NAME(sha1) = 0,
    SHA256      SWIFT_NAME(sha256) = 1,
    SHA512      SWIFT_NAME(sha512) = 2,
  } CLOSED_ENUM;

} // namespace margelo::nitro::totp

namespace margelo::nitro {

  using namespace margelo::nitro::totp;

  // C++ SupportedAlgorithm <> JS SupportedAlgorithm (union)
  template <>
  struct JSIConverter<SupportedAlgorithm> {
    static inline SupportedAlgorithm fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      std::string unionValue = JSIConverter<std::string>::fromJSI(runtime, arg);
      switch (hashString(unionValue.c_str(), unionValue.size())) {
        case hashString("SHA1"): return SupportedAlgorithm::SHA1;
        case hashString("SHA256"): return SupportedAlgorithm::SHA256;
        case hashString("SHA512"): return SupportedAlgorithm::SHA512;
        default: [[unlikely]]
          throw std::runtime_error("Cannot convert \"" + unionValue + "\" to enum SupportedAlgorithm - invalid value!");
      }
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, SupportedAlgorithm arg) {
      switch (arg) {
        case SupportedAlgorithm::SHA1: return JSIConverter<std::string>::toJSI(runtime, "SHA1");
        case SupportedAlgorithm::SHA256: return JSIConverter<std::string>::toJSI(runtime, "SHA256");
        case SupportedAlgorithm::SHA512: return JSIConverter<std::string>::toJSI(runtime, "SHA512");
        default: [[unlikely]]
          throw std::runtime_error("Cannot convert SupportedAlgorithm to JS - invalid value: "
                                    + std::to_string(static_cast<int>(arg)) + "!");
      }
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isString()) {
        return false;
      }
      std::string unionValue = JSIConverter<std::string>::fromJSI(runtime, value);
      switch (hashString(unionValue.c_str(), unionValue.size())) {
        case hashString("SHA1"):
        case hashString("SHA256"):
        case hashString("SHA512"):
          return true;
        default:
          return false;
      }
    }
  };

} // namespace margelo::nitro
