import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button, Input, QRCode } from '../components';

import { colors } from '../theme/colors';

import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroHotp,
  parseSecretKey,
  SupportedAlgorithm,
  NitroSecret,
} from 'react-native-nitro-totp';

const DEFAULT_SECRET_KEY = 'JBSWY3DPEHPK3PXP';

const nitroHotp = new NitroHotp();
const nitroSecret = new NitroSecret();

export default function HOTPScreen() {
  const [secretKey, setSecretKey] = useState<string>(
    formatSecretKey(DEFAULT_SECRET_KEY)
  );
  const [hotpCode, setHotpCode] = useState<string>('');
  const [hotpCounter, setHotpCounter] = useState<number>(0);
  const [testOtp, setTestOtp] = useState<string>('');
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null
  );
  const [hotpAuthURL, setHotpAuthURL] = useState<string>('');

  const generateSecretKey = () => {
    const secret = nitroSecret.generate();
    const formattedSecret = formatSecretKey(secret);
    setSecretKey(formattedSecret);
    setHotpCounter(0);
    generateAuthURL(secret);
  };

  const generateHOTP = useCallback(() => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroHotp.generate(secret, { counter: hotpCounter });
    setHotpCode(formatOTP(code));
    setHotpCounter((prev) => prev + 1);
  }, [hotpCounter, secretKey]);

  const generateAuthURL = useCallback(
    (secret?: string) => {
      const secretToUse = secret || parseSecretKey(secretKey);
      if (!secretToUse) return;

      const hotpUrl = nitroHotp.generateAuthURL({
        secret: secretToUse,
        issuer: 'NitroHotp Example',
        label: 'Example Account',
        algorithm: SupportedAlgorithm.SHA1,
        digits: 6,
        counter: 0,
      });

      setHotpAuthURL(hotpUrl);
    },
    [secretKey]
  );

  const validateOTP = useCallback(() => {
    if (!secretKey || !testOtp) return;

    const secret = parseSecretKey(secretKey);
    // For HOTP validation, we need to check against a range of counters
    // since the counter might be out of sync
    let isValid = false;
    for (let i = Math.max(0, hotpCounter - 10); i <= hotpCounter + 10; i++) {
      const code = nitroHotp.generate(secret, { counter: i });
      if (formatOTP(code) === testOtp) {
        isValid = true;
        break;
      }
    }
    setValidationResult(isValid);
  }, [secretKey, testOtp, hotpCounter]);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text.trim());
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const onSecretKeyChange = (text: string) => {
    setSecretKey(text);
    if (isSecretKeyValid(text)) {
      generateAuthURL();
    }
  };

  const resetCounter = () => {
    setHotpCounter(0);
    setHotpCode('');
  };

  useEffect(() => {
    generateAuthURL(DEFAULT_SECRET_KEY);
  }, [generateAuthURL]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secret Key</Text>
          <Input
            placeholder="Enter or generate a secret key"
            value={secretKey}
            onChangeText={onSecretKeyChange}
            multiline
          />
          <Button title="Generate Random Secret" onPress={generateSecretKey} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOTP Code</Text>
          <View style={styles.otpContainer}>
            <Text style={styles.otpCode}>{hotpCode || '------'}</Text>
            <Text style={styles.counter}>Counter: {hotpCounter}</Text>
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <Button title="Generate HOTP" onPress={generateHOTP} />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Copy Code"
                onPress={() => copyToClipboard(hotpCode, 'HOTP Code')}
              />
            </View>
          </View>
          <View style={styles.resetContainer}>
            <Button
              title="Reset Counter"
              onPress={resetCounter}
              variant="secondary"
              style={{ backgroundColor: '#FF6B6B' }}
              textStyle={{ color: 'white' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validate OTP</Text>
          <Input
            textContentType="oneTimeCode"
            placeholder="Enter OTP to validate"
            value={testOtp}
            onChangeText={setTestOtp}
            keyboardType="numeric"
            maxLength={7}
          />
          <Button title="Validate" onPress={validateOTP} />
          {validationResult !== null && (
            <Text
              style={[
                styles.validationResult,
                validationResult ? styles.validText : styles.invalidText,
              ]}
            >
              {validationResult ? '✅ Valid OTP' : '❌ Invalid OTP'}
            </Text>
          )}
          <Text style={styles.validationNote}>
            Note: HOTP validation checks ±10 counter values around current
            counter for synchronization.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auth URL & QR Code</Text>

          {hotpAuthURL ? (
            <View style={styles.qrContainer}>
              <QRCode
                value={hotpAuthURL}
                size={200}
                backgroundColor="#ffffff"
                foregroundColor="#000000"
                style={{ alignSelf: 'center' }}
              />
              <Button
                title="Copy Auth URL"
                onPress={() => copyToClipboard(hotpAuthURL, 'HOTP Auth URL')}
              />
            </View>
          ) : null}

          <Text style={styles.urlLabel}>HOTP URL:</Text>
          <Text
            style={styles.urlText}
            numberOfLines={3}
            onPress={() => copyToClipboard(hotpAuthURL, 'HOTP URL')}
          >
            {hotpAuthURL}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: colors.backgroundLight,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  otpCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.hotpRed,
    letterSpacing: 4,
    marginBottom: 10,
  },
  counter: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  resetContainer: {
    marginTop: 10,
  },
  validationResult: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  validText: {
    color: colors.success,
  },
  invalidText: {
    color: colors.error,
  },
  validationNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grayMedium,
    marginBottom: 8,
  },
  urlText: {
    fontSize: 12,
    color: colors.blue,
    backgroundColor: colors.blueLight,
    padding: 12,
    borderRadius: 8,
    lineHeight: 16,
  },
  qrContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
});
