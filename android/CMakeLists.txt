project(NitroTotp)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME NitroTotp)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

# Define C++ library and add all sources
add_library(${PACKAGE_NAME} SHARED
        src/main/cpp/cpp-adapter.cpp
        ../cpp/HybridNitroTotp.cpp
        ../cpp/HybridNitroHotp.cpp
        ../cpp/HybridNitroSecret.cpp
        ../cpp/Secret.cpp
        ../cpp/Hmac.cpp
        ../cpp/BaseOptions.cpp
        ../cpp/Base32.cpp
        ../cpp/Utils.cpp
)

# Add Nitrogen specs :)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroTotp+autolinking.cmake)

# Set up local includes
include_directories(
        "src/main/cpp"
        "../cpp"
)

find_library(LOG_LIB log)

find_package(openssl REQUIRED CONFIG)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android                                   # <-- Android core
        openssl::crypto
        openssl::ssl
)
