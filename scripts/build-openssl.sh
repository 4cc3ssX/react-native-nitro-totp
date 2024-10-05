#!/bin/bash

# Clone or download the sources (it's done for you at below)
# You should most definitely read the ANDROID notes to see the exact command. A lot of the scripts online are outdated for the 1.X branches
# You basically need to set the ANDROID_NDK_ROOT variable for this script to work
# Generating the dylibs was failing for me, so disabled it for now

# set -v
set -ex

export OPENSSL_VERSION="openssl"
# rm -rf ${OPENSSL_VERSION}
# curl -O "https://www.openssl.org/source/${OPENSSL_VERSION}.tar.gz"
# tar xfz "${OPENSSL_VERSION}.tar.gz"

ANDROID_PLATFORM=$1
ANDROID_API="${ANDROID_PLATFORM: -2}" # From android-21 to 21
OUTPUT_DIR=$2 # Path to the root of the project
export ANDROID_SDK_ROOT=$3
export ANDROID_NDK_ROOT=$4

# Function to map Android ABI to OpenSSL architecture
map_abi_to_architecture() {
  case $1 in
    armeabi-v7a)
      echo "android-arm"
      ;;
    arm64-v8a)
      echo "android-arm64"
      ;;
    x86)
      echo "android-x86"
      ;;
    x86_64)
      echo "android-x86_64"
      ;;
    *)
      echo "Unknown ABI: $1"
      exit 1
      ;;
  esac
}

build_android_clang() {
  ABI=$1
  ARCHITECTURE=$(map_abi_to_architecture $ABI)
  TOOLCHAIN=$2

  echo ""
  echo "Building libcrypto & libssl for $ARCHITECTURE"
  echo ""

  # Check if the architecture is already built
  if [ -d "$OUTPUT_DIR/android-${ABI}" ]; then
    echo "Skipping build for ${ABI} since it already exists."
    return
  fi

  # Set toolchain
  export TOOLCHAIN_ROOT=$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/darwin-x86_64
  export SYSROOT=$TOOLCHAIN_ROOT/sysroot
  export CC=${TOOLCHAIN}21-clang
  export CXX=${TOOLCHAIN}21-clang++
  export CXXFLAGS="-fPIC"
  export CPPFLAGS="-DANDROID -fPIC"

  export PATH=$TOOLCHAIN_ROOT/bin:$SYSROOT/usr/local/bin:$PATH

  cd "${OPENSSL_VERSION}"

  ./Configure $ARCHITECTURE no-asm no-shared -D__ANDROID_API__=$ANDROID_API

  make clean
  # Apply patch that fixes the armcap instruction
  # Linux version
  # sed -e '/[.]hidden.*OPENSSL_armcap_P/d; /[.]extern.*OPENSSL_armcap_P/ {p; s/extern/hidden/ }' -i -- crypto/*arm*pl crypto/*/asm/*arm*pl
  # macOS version
  sed -E -i '' -e '/[.]hidden.*OPENSSL_armcap_P/d' -e '/[.]extern.*OPENSSL_armcap_P/ {p; s/extern/hidden/; }' crypto/*arm*pl crypto/*/asm/*arm*pl

  make

  mkdir -p $OUTPUT_DIR/android-${ABI}/lib
  mkdir -p $OUTPUT_DIR/android-${ABI}/include

  cp libcrypto.a $OUTPUT_DIR/android-${ABI}/lib/libcrypto.a
  cp libssl.a $OUTPUT_DIR/android-${ABI}/lib/libssl.a

  cp -R include/openssl $OUTPUT_DIR/android-${ABI}/include

  cd ..
}

build_android_clang "armeabi-v7a" "armv7a-linux-androideabi"
build_android_clang "x86" "i686-linux-android"
build_android_clang "x86_64" "x86_64-linux-android"
build_android_clang "arm64-v8a" "aarch64-linux-android"

echo "OpenSSL finished compiling"
