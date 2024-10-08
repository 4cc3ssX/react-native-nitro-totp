///
/// NitroTotpOnLoad.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2024 Marc Rousavy @ Margelo
///

#include "NitroTotpOnLoad.hpp"

#include <jni.h>
#include <fbjni/fbjni.h>
#include <NitroModules/HybridObjectRegistry.hpp>

#include "HybridNitroTotp.hpp"
#include "HybridNitroSecret.hpp"
#include "HybridNitroHotp.hpp"

namespace margelo::nitro::totp {

int initialize(JavaVM* vm) {
  using namespace margelo::nitro;
  using namespace margelo::nitro::totp;
  using namespace facebook;

  return facebook::jni::initialize(vm, [] {
    // Register native JNI methods
    

    // Register Nitro Hybrid Objects
    HybridObjectRegistry::registerHybridObjectConstructor(
      "NitroTotp",
      []() -> std::shared_ptr<HybridObject> {
        static_assert(std::is_default_constructible_v<HybridNitroTotp>,
                      "The HybridObject \"HybridNitroTotp\" is not default-constructible! "
                      "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
        return std::make_shared<HybridNitroTotp>();
      }
    );
    HybridObjectRegistry::registerHybridObjectConstructor(
      "NitroSecret",
      []() -> std::shared_ptr<HybridObject> {
        static_assert(std::is_default_constructible_v<HybridNitroSecret>,
                      "The HybridObject \"HybridNitroSecret\" is not default-constructible! "
                      "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
        return std::make_shared<HybridNitroSecret>();
      }
    );
    HybridObjectRegistry::registerHybridObjectConstructor(
      "NitroHOTP",
      []() -> std::shared_ptr<HybridObject> {
        static_assert(std::is_default_constructible_v<HybridNitroHotp>,
                      "The HybridObject \"HybridNitroHotp\" is not default-constructible! "
                      "Create a public constructor that takes zero arguments to be able to autolink this HybridObject.");
        return std::make_shared<HybridNitroHotp>();
      }
    );
  });
}

} // namespace margelo::nitro::totp
