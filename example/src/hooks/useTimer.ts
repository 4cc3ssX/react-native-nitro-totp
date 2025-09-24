import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  /**
   * Timer period in seconds
   */
  period?: number;
  /**
   * Update interval in milliseconds
   */
  updateInterval?: number;
  /**
   * Auto-start the timer
   */
  autoStart?: boolean;
}

interface UseTimerReturn {
  /**
   * Time remaining in seconds
   */
  timeRemaining: number;
  /**
   * Progress from 100% to 0% (decay)
   */
  progress: number;
  /**
   * Whether the timer is running
   */
  isRunning: boolean;
  /**
   * Start the timer
   */
  start: () => void;
  /**
   * Stop the timer
   */
  stop: () => void;
  /**
   * Reset the timer
   */
  reset: () => void;
  /**
   * Restart the timer (reset + start)
   */
  restart: () => void;
}

/**
 * Custom hook for managing TOTP timers with decay progress
 * Progress starts at 100% and decays to 0% as time expires
 */
export const useTimer = ({
  period = 30,
  updateInterval = 1000,
  autoStart = true,
}: UseTimerOptions = {}): UseTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(period);
  const [isRunning, setIsRunning] = useState(autoStart);

  const calculateTimeRemaining = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    return period - (now % period);
  }, [period]);

  const updateTimer = useCallback(() => {
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);
  }, [calculateTimeRemaining]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(period);
  }, [period]);

  const restart = useCallback(() => {
    reset();
    start();
  }, [reset, start]);

  // Calculate progress from 100% to 0% (decay)
  const progress = (timeRemaining / period) * 100;

  useEffect(() => {
    if (!isRunning) return;

    // Update immediately
    updateTimer();

    const interval = setInterval(updateTimer, updateInterval);
    return () => clearInterval(interval);
  }, [isRunning, updateTimer, updateInterval]);

  return {
    timeRemaining,
    progress,
    isRunning,
    start,
    stop,
    reset,
    restart,
  };
};
