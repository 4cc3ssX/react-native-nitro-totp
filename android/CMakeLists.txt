project(NitroTotp)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME NitroTotp)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

# Compile OpenSSL (ensure this runs before anything else)
execute_process(
    COMMAND chmod u+x ${CMAKE_CURRENT_SOURCE_DIR}/../scripts/build-openssl.sh
    OUTPUT_FILE ${CMAKE_CURRENT_SOURCE_DIR}/build/openssh_build_chmod.txt
    ERROR_FILE ${CMAKE_CURRENT_SOURCE_DIR}/build/openssh_build_chmod_error.txt
)

execute_process(
    COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/../scripts/build-openssl.sh
    ${ANDROID_PLATFORM} "${CMAKE_CURRENT_SOURCE_DIR}/../cpp" ${ANDROID_HOME} ${ANDROID_NDK_ROOT}
    OUTPUT_FILE ${CMAKE_CURRENT_SOURCE_DIR}/build/openssl_build.txt
    ERROR_FILE ${CMAKE_CURRENT_SOURCE_DIR}/build/openssl_error.txt
)

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

find_library(LOG_LIB log)

# Add libcrypto and libssl as static imported libraries
add_library(libcrypto STATIC IMPORTED)
set_target_properties(libcrypto PROPERTIES IMPORTED_LOCATION ${PROJECT_SOURCE_DIR}/../cpp/android-${ANDROID_ABI}/lib/libcrypto.a)

add_library(libssl STATIC IMPORTED)
set_target_properties(libssl PROPERTIES IMPORTED_LOCATION ${PROJECT_SOURCE_DIR}/../cpp/android-${ANDROID_ABI}/lib/libssl.a)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android                                   # <-- Android core
        libcrypto                                 # OpenSSL libcrypto
        libssl                                    # OpenSSL libssl
)
