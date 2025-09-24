import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ProgressBar, Button, Input, QRCode } from '../components';
import { useTimer } from '../hooks/useTimer';

import { getProgressColor } from '../utils/totpHelpers';
import { PROGRESS_BAR_HEIGHT, PROGRESS_BAR_BORDER_RADIUS } from '../constants';
import { colors } from '../theme/colors';

import {
  formatOTP,
  formatSecretKey,
  NitroTotp,
  parseSecretKey,
  SupportedAlgorithm,
  NitroSecret,
} from 'react-native-nitro-totp';
import { TotpConfigs } from '../configs/totp';

const nitroTotp = new NitroTotp();
const nitroSecret = new NitroSecret();

export default function TOTPScreen() {
  const [secretKey, setSecretKey] = useState<string>(
    formatSecretKey(TotpConfigs.DEFAULT_SECRET_KEY)
  );
  const [totpCode, setTotpCode] = useState<string>('');
  const [testOtp, setTestOtp] = useState<string>('');
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null
  );
  const [totpAuthURL, setTotpAuthURL] = useState<string>('');

  const { timeRemaining, progress } = useTimer({
    period: 30,
    autoStart: true,
  });

  const generateSecretKey = () => {
    const secret = nitroSecret.generate();
    const formattedSecret = formatSecretKey(secret);
    setSecretKey(formattedSecret);
    generateTOTP();
    generateAuthURL(secret);
  };

  const generateTOTP = useCallback(() => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, [secretKey]);

  const generateAuthURL = useCallback(
    (secret?: string) => {
      const secretToUse = secret || parseSecretKey(secretKey);
      if (!secretToUse) return;

      const totpUrl = nitroTotp.generateAuthURL({
        secret: secretToUse,
        issuer: 'NitroTotp Example',
        label: 'Example Account',
        algorithm: SupportedAlgorithm.SHA1,
        digits: 6,
        period: 30,
      });

      setTotpAuthURL(totpUrl);
    },
    [secretKey]
  );

  const validateOTP = useCallback(() => {
    if (!secretKey || !testOtp) return;

    const secret = parseSecretKey(secretKey);
    const otp = testOtp.replace(/\s+/g, '');
    const isValid = nitroTotp.validate(secret, otp);
    setValidationResult(isValid);
  }, [secretKey, testOtp]);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text.trim());
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const onSecretKeyChange = (text: string) => {
    setSecretKey(text);
    if (nitroSecret.isValid(text)) {
      generateAuthURL();
    }
  };

  useEffect(() => {
    generateAuthURL(TotpConfigs.DEFAULT_SECRET_KEY);

    const secret = parseSecretKey(
      formatSecretKey(TotpConfigs.DEFAULT_SECRET_KEY)
    );
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, [generateAuthURL]);

  // Generate TOTP when timer resets (timeRemaining goes from 1 to 30)
  useEffect(() => {
    if (timeRemaining === 30 && secretKey) {
      generateTOTP();
    }
  }, [timeRemaining, secretKey, generateTOTP]);

  const progressColor = getProgressColor(timeRemaining);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secret Key</Text>
          <Input
            placeholder="Enter or generate a secret key"
            value={secretKey}
            onChangeText={onSecretKeyChange}
            multiline
          />
          <Button
            title="Generate Random Secret"
            onPress={generateSecretKey}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOTP Code</Text>
          <View style={styles.otpContainer}>
            <Text selectable style={styles.otpCode}>
              {totpCode || '------'}
            </Text>
            <Text style={styles.timer}>Expires in: {timeRemaining}s</Text>
            <ProgressBar
              progress={progress / 100}
              width={null}
              height={PROGRESS_BAR_HEIGHT}
              color={progressColor}
              unfilledColor={colors.unfilled}
              borderRadius={PROGRESS_BAR_BORDER_RADIUS}
            />
          </View>
          <Button
            title="Copy TOTP Code"
            onPress={() => copyToClipboard(totpCode, 'TOTP Code')}
          />
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
          <Button
            title="Validate"
            onPress={validateOTP}
            style={{ marginTop: 12 }}
          />
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auth URL & QR Code</Text>

          {totpAuthURL ? (
            <View style={styles.qrContainer}>
              <QRCode
                value={totpAuthURL}
                size={200}
                backgroundColor="#ffffff"
                foregroundColor="#000000"
                style={{ alignSelf: 'center' }}
              />
              <Button
                title="Copy Auth URL"
                onPress={() => copyToClipboard(totpAuthURL, 'TOTP Auth URL')}
              />
            </View>
          ) : null}

          <Text style={styles.urlLabel}>TOTP URL:</Text>
          <Text
            style={styles.urlText}
            numberOfLines={3}
            onPress={() => copyToClipboard(totpAuthURL, 'TOTP URL')}
          >
            {totpAuthURL}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpCode: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 8,
    marginBottom: 12,
    fontFamily: 'Courier New',
  },
  timer: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  validationResult: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  validText: {
    color: '#4CAF50',
  },
  invalidText: {
    color: '#F44336',
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 12,
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
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
