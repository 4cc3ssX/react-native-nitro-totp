///
/// HybridNitroTotpSpec.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2024 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/HybridObject.hpp>)
#include <NitroModules/HybridObject.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `NitroTotpGenerateOptions` to properly resolve imports.
namespace margelo::nitro::totp { struct NitroTotpGenerateOptions; }
// Forward declaration of `NitroTotpValidateOptions` to properly resolve imports.
namespace margelo::nitro::totp { struct NitroTotpValidateOptions; }
// Forward declaration of `OTPAuthURLOptions` to properly resolve imports.
namespace margelo::nitro::totp { struct OTPAuthURLOptions; }

#include <string>
#include <optional>
#include "NitroTotpGenerateOptions.hpp"
#include "NitroTotpValidateOptions.hpp"
#include "OTPAuthURLOptions.hpp"

namespace margelo::nitro::totp {

  using namespace margelo::nitro;

  /**
   * An abstract base class for `NitroTotp`
   * Inherit this class to create instances of `HybridNitroTotpSpec` in C++.
   * @example
   * ```cpp
   * class HybridNitroTotp: public HybridNitroTotpSpec {
   *   // ...
   * };
   * ```
   */
  class HybridNitroTotpSpec: public virtual HybridObject {
    public:
      // Constructor
      explicit HybridNitroTotpSpec(): HybridObject(TAG) { }

      // Destructor
      virtual ~HybridNitroTotpSpec() { }

    public:
      // Properties
      

    public:
      // Methods
      virtual std::string generate(const std::string& secret, const std::optional<NitroTotpGenerateOptions>& options) = 0;
      virtual bool validate(const std::string& secret, const std::string& otp, const std::optional<NitroTotpValidateOptions>& options) = 0;
      virtual std::string generateAuthURL(const OTPAuthURLOptions& options) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "NitroTotp";
  };

} // namespace margelo::nitro::totp
