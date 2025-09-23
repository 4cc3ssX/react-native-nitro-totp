import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { ProgressBar } from '../components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
  formatOTP,
  formatSecretKey,
  NitroTotp,
  parseSecretKey,
} from 'react-native-nitro-totp';

import {
  calculateTimeRemaining,
  getProgressPercentage,
  getProgressColor,
  formatSecretForDisplay,
} from '../utils/totpHelpers';
import {
  UPDATE_INTERVAL_MS,
  PROGRESS_BAR_HEIGHT,
  PROGRESS_BAR_BORDER_RADIUS,
  PERCENTAGE_MULTIPLIER,
} from '../constants';
import { colors } from '../theme/colors';

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Constants
const DEFAULT_SECRET_KEY = 'JBSWY3DPEHPK3PXP';

const nitroTotp = new NitroTotp();

interface TimezoneData {
  name: string;
  offset: number; // offset in hours from UTC for display
  description: string;
  dayjsZone?: string; // dayjs timezone identifier
}

const timezones: TimezoneData[] = [
  {
    name: 'UTC',
    offset: 0,
    description: 'Coordinated Universal Time',
    dayjsZone: 'UTC',
  },
  {
    name: 'EST',
    offset: -5,
    description: 'Eastern Standard Time',
    dayjsZone: 'America/New_York',
  },
  {
    name: 'PST',
    offset: -8,
    description: 'Pacific Standard Time',
    dayjsZone: 'America/Los_Angeles',
  },
  {
    name: 'CET',
    offset: 1,
    description: 'Central European Time',
    dayjsZone: 'Europe/Berlin',
  },
  {
    name: 'JST',
    offset: 9,
    description: 'Japan Standard Time',
    dayjsZone: 'Asia/Tokyo',
  },
  {
    name: 'AEST',
    offset: 10,
    description: 'Australian Eastern Standard Time',
    dayjsZone: 'Australia/Sydney',
  },
];

interface TOTPResult {
  timezone: string;
  currentTime: Date;
  totpCode: string;
  timeRemaining: number;
}

export default function TimeZonesScreen() {
  const [secretKey] = useState<string>(formatSecretKey(DEFAULT_SECRET_KEY));
  const [totpResults, setTotpResults] = useState<TOTPResult[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const generateTOTPForTimezones = useCallback(() => {
    const secret = parseSecretKey(secretKey);
    const results: TOTPResult[] = [];

    timezones.forEach((tz) => {
      // Get current time in the specific timezone using dayjs
      const timezoneTime = tz.dayjsZone
        ? dayjs().tz(tz.dayjsZone)
        : dayjs().utcOffset(tz.offset);

      // Generate TOTP using the timezone's current time
      const code = nitroTotp.generate(secret, {
        currentTime: timezoneTime.unix(),
      });

      // Calculate time remaining for this timezone
      const timeRemaining = calculateTimeRemaining(timezoneTime.unix());

      results.push({
        timezone: tz.name,
        currentTime: timezoneTime.toDate(),
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

  const formatDate = (date: Date): string => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  useEffect(() => {
    generateTOTPForTimezones();
    const interval = setInterval(generateTOTPForTimezones, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [generateTOTPForTimezones]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Time Zone OTP Generation</Text>
          <Text style={styles.subtitle}>
            Testing currentTime parameter across different time zones
          </Text>
          <Text style={styles.secretInfo}>
            Secret: {formatSecretForDisplay(secretKey)}
          </Text>
          <Text style={styles.lastUpdate}>
            Last updated: {formatTime(lastUpdate)}
          </Text>
        </View>

        <View style={styles.refreshSection}>
          <Button
            title="Refresh All"
            onPress={generateTOTPForTimezones}
            color="#2196F3"
          />
        </View>

        {totpResults.map((result, index) => {
          const tz = timezones[index];
          const progressPercentage = getProgressPercentage(
            result.timeRemaining
          );
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
                  {formatTime(result.currentTime)}
                </Text>
                <Text style={styles.currentDate}>
                  {formatDate(result.currentTime)}
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
                  progress={progressPercentage / PERCENTAGE_MULTIPLIER}
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
                  color="#666"
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  secretInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#888',
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
});
