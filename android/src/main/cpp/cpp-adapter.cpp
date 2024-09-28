#include <jni.h>
#include "NitroTotpOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::totp::initialize(vm);
}
