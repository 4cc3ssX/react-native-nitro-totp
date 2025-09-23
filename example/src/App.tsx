import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroTotp,
  NitroHotp,
  parseSecretKey,
  SupportedAlgorithm,
  NitroSecret,
} from 'react-native-nitro-totp';

const DEFAULT_SECRET_KEY = 'JBSWY3DPEHPK3PXP';

const nitroTotp = new NitroTotp();
const nitroHotp = new NitroHotp();
const nitroSecret = new NitroSecret();

function NitroTotpExample() {
  const [secretKey, setSecretKey] = useState<string>(
    formatSecretKey(DEFAULT_SECRET_KEY)
  );
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

  const generateSecretKey = () => {
    const secret = nitroSecret.generate();
    const formattedSecret = formatSecretKey(secret);
    setSecretKey(formattedSecret);
    generateTOTP();
    generateAuthURLs(secret);
  };

  const generateTOTP = useCallback(() => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, [secretKey]);

  const generateHOTP = useCallback(() => {
    if (!secretKey) return;

    const secret = parseSecretKey(secretKey);
    const code = nitroHotp.generate(secret, { counter: hotpCounter });
    setHotpCode(formatOTP(code));
    setHotpCounter((prev) => prev + 1);
  }, [hotpCounter, secretKey]);

  const generateAuthURLs = useCallback(
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

      const hotpUrl = nitroHotp.generateAuthURL({
        secret: secretToUse,
        issuer: 'NitroHotp Example',
        label: 'Example Account',
        algorithm: SupportedAlgorithm.SHA1,
        digits: 6,
        counter: 0,
      });

      setTotpAuthURL(totpUrl);
      setHotpAuthURL(hotpUrl);
    },
    [secretKey]
  );

  const validateOTP = useCallback(() => {
    if (!secretKey || !testOtp) return;

    const secret = parseSecretKey(secretKey);
    const isValid = nitroTotp.validate(secret, testOtp);
    setValidationResult(isValid);
  }, [secretKey, testOtp]);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text.trim());
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const onSecretKeyChange = (text: string) => {
    setSecretKey(text);
    if (isSecretKeyValid(text)) {
      generateAuthURLs();
    }
  };

  useEffect(() => {
    generateAuthURLs(DEFAULT_SECRET_KEY);

    const secret = parseSecretKey(formatSecretKey(DEFAULT_SECRET_KEY));
    const code = nitroTotp.generate(secret);
    setTotpCode(formatOTP(code));
  }, [generateAuthURLs]);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const timeLeft = 30 - Math.floor((now / 1000) % 30);
    setTimeRemaining(timeLeft);

    if (timeLeft === 30 && secretKey) {
      generateTOTP();
    }
  }, [secretKey, generateTOTP]);

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const progressPercentage = ((30 - timeRemaining) / 30) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🔐 NitroTotp Example</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secret Key</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter or generate a secret key"
            value={secretKey}
            onChangeText={onSecretKeyChange}
            multiline
          />
          <Button title="Generate Random Secret" onPress={generateSecretKey} />
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
          <Button
            title="Copy TOTP Code"
            onPress={() => copyToClipboard(totpCode, 'TOTP Code')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOTP (Counter-based)</Text>
          <View style={styles.otpContainer}>
            <Text style={styles.otpCode}>{hotpCode || '------'}</Text>
            <Text style={styles.timer}>Counter: {hotpCounter}</Text>
          </View>
          <Button title="Generate HOTP" onPress={generateHOTP} />
          <View style={{ marginTop: 10 }}>
            <Button
              title="Copy HOTP Code"
              onPress={() => copyToClipboard(hotpCode, 'HOTP Code')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validate OTP</Text>
          <TextInput
            textContentType="oneTimeCode"
            style={styles.input}
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
          <Pressable onPress={() => copyToClipboard(totpAuthURL, 'TOTP URL')}>
            <Text style={styles.urlText} numberOfLines={3}>
              {totpAuthURL}
            </Text>
          </Pressable>

          <Text style={styles.urlLabel}>HOTP URL:</Text>
          <Pressable onPress={() => copyToClipboard(hotpAuthURL, 'HOTP URL')}>
            <Text style={styles.urlText} numberOfLines={3}>
              {hotpAuthURL}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NitroTotpExample />
    </SafeAreaProvider>
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
