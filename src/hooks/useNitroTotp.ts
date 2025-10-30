import { useCallback, useMemo } from 'react';
import type { NitroTotpGenerateOptions, OTPAuthURLOptions } from '../types';
import { NitroTotp } from '../NitroTotp';
import { NitroTotpConstants } from '../constants';
import { useTimer, type UseTimerOptions } from './internal/useTimer';

interface UseNitroTotpResult {
  /**
   * The current TOTP code
   */
  otp: string;
  /**
   * Time remaining in seconds before the current TOTP code expires
   */
  timeRemaining: number;
  /**
   * Progress indicator from 0 to 1
   * (0 = fresh code, 1 = about to expire)
   */
  progress: number;
  /**
   * Generate an auth URL for the TOTP (omits secret field as it's passed to the hook)
   */
  generateAuthUrl: (options: Omit<OTPAuthURLOptions, 'secret'>) => string;
}

const nitroTotp = new NitroTotp();

/**
 * A hook that generates and manages TOTP codes with timing
 * @param secret - The secret key to use for generating TOTPs
 * @param options - Optional parameters for TOTP generation
 * @returns An object containing the current OTP, remaining time, progress, and auth URL generator
 */
export function useNitroTotp(
  secret: string,
  options: NitroTotpGenerateOptions & Omit<UseTimerOptions, 'period'> = {}
): UseNitroTotpResult {
  const { autoStart, updateInterval, ...totpOptions } = options;
  const period = options.period ?? NitroTotpConstants.DEFAULT_PERIOD;
  const { timeRemaining, progress } = useTimer({
    period,
    autoStart,
    updateInterval,
  });

  const otp = useMemo(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    return nitroTotp.generate(secret, {
      ...totpOptions,
      currentTime,
    });
  }, [secret, totpOptions]);

  const generateAuthUrl = useCallback(
    (urlOptions: Omit<OTPAuthURLOptions, 'secret'>) => {
      return nitroTotp.generateAuthURL({
        ...urlOptions,
        secret,
      });
    },
    [secret]
  );

  return {
    otp,
    timeRemaining,
    progress,
    generateAuthUrl,
  };
}
