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
        "${PROJECT_SOURCE_DIR}/../cpp/android-${ANDROID_ABI}/include"
)

# Add libcrypto and libssl as static imported libraries
add_library(libcrypto STATIC IMPORTED)
set_target_properties(libcrypto PROPERTIES IMPORTED_LOCATION
    "${PROJECT_SOURCE_DIR}/../cpp/android-${ANDROID_ABI}/lib/libcrypto.a")

add_library(libssl STATIC IMPORTED)
set_target_properties(libssl PROPERTIES IMPORTED_LOCATION
    "${PROJECT_SOURCE_DIR}/../cpp/android-${ANDROID_ABI}/lib/libssl.a")

find_library(LOG_LIB log)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android                                   # <-- Android core
        libcrypto                                 # OpenSSL libcrypto
        libssl                                    # OpenSSL libssl
)
