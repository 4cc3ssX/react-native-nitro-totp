import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroTotp,
  NitroHotp,
  parseSecretKey,
  SupportedAlgorithm,
} from 'react-native-nitro-totp';

export default function App() {
  const [secretKey, setSecretKey] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [hotpCode, setHotpCode] = useState<string>('');
  const [hotpCounter, setHotpCounter] = useState<number>(0);
  const [testOtp, setTestOtp] = useState<string>('');
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [totpAuthURL, setTotpAuthURL] = useState<string>('');
  const [hotpAuthURL, setHotpAuthURL] = useState<string>('');

  const nitroTotp = new NitroTotp();
  const nitroHotp = new NitroHotp();

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeLeft = 30 - Math.floor((now / 1000) % 30);
    setTimeRemaining(timeLeft);

    if (timeLeft === 30 && secretKey) {
      generateTOTP();
    }
  }, [secretKey]);

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const generateSecretKey = () => {
    const secret = nitroTotp.secret.generate();
    const formattedSecret = formatSecretKey(secret);
    setSecretKey(formattedSecret);
    generateTOTP();
    generateAuthURLs(secret);
  };

  const generateTOTP = () => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  };

  const generateHOTP = () => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroHotp.generate(secret, { counter: hotpCounter });
    setHotpCode(formatOTP(code));
    setHotpCounter((prev) => prev + 1);
  };

  const generateAuthURLs = (secret?: string) => {
    const secretToUse = secret || parseSecretKey(secretKey);
    if (!secretToUse) return;

    const totpUrl = nitroTotp.generateAuthURL({
      secret: secretToUse,
      issuer: 'NitroTotp Demo',
      label: 'Demo Account',
      algorithm: SupportedAlgorithm.SHA1,
      digits: 6,
      period: 30,
    });

    const hotpUrl = nitroHotp.generateAuthURL({
      secret: secretToUse,
      issuer: 'NitroHotp Demo',
      label: 'Demo Account',
      algorithm: SupportedAlgorithm.SHA1,
      digits: 6,
      counter: 0,
    });

    setTotpAuthURL(totpUrl);
    setHotpAuthURL(hotpUrl);
  };

  const validateOTP = () => {
    if (!secretKey || !testOtp) return;

    const secret = parseSecretKey(secretKey);
    const isValid = nitroTotp.validate(secret, testOtp);
    setValidationResult(isValid);
  };

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const onSecretKeyChange = (text: string) => {
    setSecretKey(text);
    if (isSecretKeyValid(text)) {
      generateAuthURLs();
    }
  };

  useEffect(() => {
    const defaultSecret = 'JBSWY3DPEHPK3PXP';
    setSecretKey(formatSecretKey(defaultSecret));
    generateAuthURLs(defaultSecret);

    const secret = parseSecretKey(formatSecretKey(defaultSecret));
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, []);

  const progressPercentage = ((30 - timeRemaining) / 30) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🔐 NitroTotp Demo</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secret Key</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter or generate a secret key"
            value={secretKey}
            onChangeText={onSecretKeyChange}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={generateSecretKey}>
            <Text style={styles.buttonText}>Generate Random Secret</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOTP (Time-based)</Text>
          <View style={styles.otpContainer}>
            <Text style={styles.otpCode}>{totpCode || '------'}</Text>
            <Text style={styles.timer}>Expires in: {timeRemaining}s</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => copyToClipboard(totpCode, 'TOTP Code')}
          >
            <Text style={styles.buttonText}>Copy TOTP Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOTP (Counter-based)</Text>
          <View style={styles.otpContainer}>
            <Text style={styles.otpCode}>{hotpCode || '------'}</Text>
            <Text style={styles.timer}>Counter: {hotpCounter}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={generateHOTP}>
            <Text style={styles.buttonText}>Generate HOTP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => copyToClipboard(hotpCode, 'HOTP Code')}
          >
            <Text style={styles.buttonText}>Copy HOTP Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validate OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP to validate"
            value={testOtp}
            onChangeText={setTestOtp}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity style={styles.button} onPress={validateOTP}>
            <Text style={styles.buttonText}>Validate</Text>
          </TouchableOpacity>
          {validationResult !== null && (
            <Text
              style={[
                styles.validationResult,
                { color: validationResult ? '#4CAF50' : '#F44336' },
              ]}
            >
              {validationResult ? '✅ Valid' : '❌ Invalid'}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auth URLs</Text>
          <Text style={styles.urlLabel}>TOTP URL:</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(totpAuthURL, 'TOTP URL')}
          >
            <Text style={styles.urlText} numberOfLines={3}>
              {totpAuthURL}
            </Text>
          </TouchableOpacity>

          <Text style={styles.urlLabel}>HOTP URL:</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(hotpAuthURL, 'HOTP URL')}
          >
            <Text style={styles.urlText} numberOfLines={3}>
              {hotpAuthURL}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  otpCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 4,
    marginBottom: 10,
  },
  timer: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  validationResult: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  urlText: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
