///
/// NitroTotpGenerateOptions.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

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

// Forward declaration of `SupportedAlgorithm` to properly resolve imports.
namespace margelo::nitro::totp { enum class SupportedAlgorithm; }

#include <optional>
#include "SupportedAlgorithm.hpp"

namespace margelo::nitro::totp {

  /**
   * A struct which can be represented as a JavaScript object (NitroTotpGenerateOptions).
   */
  struct NitroTotpGenerateOptions {
  public:
    std::optional<double> period     SWIFT_PRIVATE;
    std::optional<double> digits     SWIFT_PRIVATE;
    std::optional<SupportedAlgorithm> algorithm     SWIFT_PRIVATE;

  public:
    NitroTotpGenerateOptions() = default;
    explicit NitroTotpGenerateOptions(std::optional<double> period, std::optional<double> digits, std::optional<SupportedAlgorithm> algorithm): period(period), digits(digits), algorithm(algorithm) {}
  };

} // namespace margelo::nitro::totp

namespace margelo::nitro {

  using namespace margelo::nitro::totp;

  // C++ NitroTotpGenerateOptions <> JS NitroTotpGenerateOptions (object)
  template <>
  struct JSIConverter<NitroTotpGenerateOptions> final {
    static inline NitroTotpGenerateOptions fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return NitroTotpGenerateOptions(
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "period")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "digits")),
        JSIConverter<std::optional<SupportedAlgorithm>>::fromJSI(runtime, obj.getProperty(runtime, "algorithm"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const NitroTotpGenerateOptions& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "period", JSIConverter<std::optional<double>>::toJSI(runtime, arg.period));
      obj.setProperty(runtime, "digits", JSIConverter<std::optional<double>>::toJSI(runtime, arg.digits));
      obj.setProperty(runtime, "algorithm", JSIConverter<std::optional<SupportedAlgorithm>>::toJSI(runtime, arg.algorithm));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "period"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "digits"))) return false;
      if (!JSIConverter<std::optional<SupportedAlgorithm>>::canConvert(runtime, obj.getProperty(runtime, "algorithm"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
