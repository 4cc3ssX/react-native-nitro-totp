///
/// NitroTotpAutolinking.mm
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#import <Foundation/Foundation.h>
#import <NitroModules/HybridObjectRegistry.hpp>

#import <type_traits>

#include "HybridNitroTotp.hpp"
#include "HybridNitroSecret.hpp"
#include "HybridNitroHotp.hpp"

@interface NitroTotpAutolinking : NSObject
@end

@implementation NitroTotpAutolinking

+ (void) load {
  using namespace margelo::nitro;
  using namespace margelo::nitro::totp;

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
}

@end
