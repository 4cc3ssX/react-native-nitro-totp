import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ProgressBar, Button, Input } from '../components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
  formatOTP,
  formatSecretKey,
  NitroTotp,
  parseSecretKey,
  NitroSecret,
} from 'react-native-nitro-totp';

import { calculateTimeRemaining, getProgressColor } from '../utils/totpHelpers';
import {
  UPDATE_INTERVAL_MS,
  PROGRESS_BAR_HEIGHT,
  PROGRESS_BAR_BORDER_RADIUS,
  TOTP_PERIOD_SECONDS,
} from '../constants';
import { colors } from '../theme/colors';
import { TotpConfigs } from '../configs/totp';

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const nitroTotp = new NitroTotp();
const nitroSecret = new NitroSecret();

interface TimezoneData {
  /**
   * Name of the timezone
   */
  name: string;
  /**
   * Offset in hours from UTC for display
   */
  offset: number;
  /**
   * Description of the timezone
   */
  description: string;
}

const timezones: TimezoneData[] = [
  {
    name: 'UTC',
    offset: 0,
    description: 'Coordinated Universal Time',
  },
  {
    name: 'EST',
    offset: -5,
    description: 'Eastern Standard Time',
  },
  {
    name: 'PST',
    offset: -8,
    description: 'Pacific Standard Time',
  },
  {
    name: 'CET',
    offset: 1,
    description: 'Central European Time',
  },
  {
    name: 'JST',
    offset: 9,
    description: 'Japan Standard Time',
  },
  {
    name: 'ICT',
    offset: 7,
    description: 'Indochina Time',
  },
  {
    name: 'AEST',
    offset: 10,
    description: 'Australian Eastern Standard Time',
  },
];

interface TOTPResult {
  timezone: string;
  currentTime: Date;
  timezoneTimeString: string; // Add this for proper timezone display
  timezoneDateString: string; // Add this for proper timezone date display
  totpCode: string;
  timeRemaining: number;
}

export default function TimeZonesScreen() {
  const [secretKey, setSecretKey] = useState<string>(
    formatSecretKey(TotpConfigs.DEFAULT_SECRET_KEY)
  );
  const [totpResults, setTotpResults] = useState<TOTPResult[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const generateSecretKey = () => {
    const secret = nitroSecret.generate();
    const formattedSecret = formatSecretKey(secret);
    setSecretKey(formattedSecret);
    generateTOTPForTimezones();
  };

  const onSecretKeyChange = (text: string) => {
    setSecretKey(text);

    if (!nitroSecret.isValid(text)) {
      setTotpResults([]);
      return;
    }

    generateTOTPForTimezones();
  };

  const generateTOTPForTimezones = useCallback(() => {
    if (!nitroSecret.isValid(secretKey)) {
      return;
    }

    const secret = parseSecretKey(secretKey);
    const results: TOTPResult[] = [];

    timezones.forEach((tz) => {
      const timezoneTime = dayjs().utcOffset(tz.offset * 60); // Fallback to manual offset if no zone provided

      // Generate TOTP using the timezone's current time
      const code = nitroTotp.generate(secret, {
        currentTime: timezoneTime.unix(),
      });

      // Calculate time remaining for this timezone
      const timeRemaining = calculateTimeRemaining(timezoneTime.unix());

      results.push({
        timezone: tz.name,
        currentTime: timezoneTime.toDate(),
        timezoneTimeString: timezoneTime.format('HH:mm:ss'),
        timezoneDateString: timezoneTime.format('MMM DD, YYYY'),
        totpCode: formatOTP(code),
        timeRemaining,
      });
    });

    setTotpResults(results);
    setLastUpdate(new Date());
  }, [secretKey]);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text.trim());
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const formatTime = (date: Date): string => {
    return dayjs(date).format('HH:mm:ss');
  };

  useEffect(() => {
    generateTOTPForTimezones();
    const interval = setInterval(generateTOTPForTimezones, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [generateTOTPForTimezones]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Time Zone OTP Generation</Text>
          <Text style={styles.subtitle}>
            Testing currentTime parameter across different time zones
          </Text>
          <Text style={styles.lastUpdate}>
            Last updated: {formatTime(lastUpdate)}
          </Text>
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

        <View style={styles.refreshSection}>
          <Button title="Refresh All" onPress={generateTOTPForTimezones} />
        </View>

        {totpResults.map((result, index) => {
          const tz = timezones[index];
          const progressPercentage =
            (result.timeRemaining / TOTP_PERIOD_SECONDS) * 100;
          const progressColor = getProgressColor(result.timeRemaining);

          return (
            <View key={result.timezone} style={styles.timezoneCard}>
              <View style={styles.timezoneHeader}>
                <Text style={styles.timezoneName}>{result.timezone}</Text>
                <Text style={styles.timezoneDescription}>
                  {tz?.description}
                </Text>
              </View>

              <View style={styles.timeInfo}>
                <Text style={styles.currentTime}>
                  {result.timezoneTimeString}
                </Text>
                <Text style={styles.currentDate}>
                  {result.timezoneDateString}
                </Text>
                <Text style={styles.offsetInfo}>
                  UTC{(tz?.offset || 0) >= 0 ? '+' : ''}
                  {tz?.offset}
                </Text>
              </View>

              <View style={styles.otpSection}>
                <Text style={styles.otpCode}>{result.totpCode}</Text>
                <Text style={styles.expiresIn}>
                  Expires in: {result.timeRemaining}s
                </Text>
                <ProgressBar
                  progress={progressPercentage / 100}
                  height={PROGRESS_BAR_HEIGHT}
                  color={progressColor}
                  unfilledColor={colors.unfilled}
                  borderRadius={PROGRESS_BAR_BORDER_RADIUS}
                />
              </View>

              <View style={styles.copyButton}>
                <Button
                  title={`Copy ${result.timezone} Code`}
                  onPress={() =>
                    copyToClipboard(
                      result.totpCode,
                      `${result.timezone} TOTP Code`
                    )
                  }
                />
              </View>
            </View>
          );
        })}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            This screen demonstrates the currentTime parameter support in
            NitroTotp. Each timezone shows the TOTP code that would be generated
            at that specific time, allowing you to test synchronization across
            different time zones.
          </Text>
          <Text style={styles.infoText}>
            The currentTime parameter accepts a Unix timestamp (seconds since
            epoch) and overrides the default system time for TOTP generation.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  headerSection: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  secretInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#888',
    marginVertical: 12,
  },
  refreshSection: {
    marginBottom: 20,
  },
  timezoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timezoneHeader: {
    marginBottom: 12,
  },
  timezoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timezoneDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timeInfo: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  currentTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3',
  },
  currentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  offsetInfo: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  otpCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 3,
    marginBottom: 8,
  },
  expiresIn: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  copyButton: {
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
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
});
