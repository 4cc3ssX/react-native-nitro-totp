import type { HybridObject } from 'react-native-nitro-modules';
import type { GenerateSecretKeyOptions } from '../types';

export interface NitroSecret
  extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
  generate(options?: GenerateSecretKeyOptions): string;
}
