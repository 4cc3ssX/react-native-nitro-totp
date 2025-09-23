export const colors = {
  // Progress colors
  green: '#4CAF50',
  orange: '#FF9800',
  red: '#F44336',

  // Primary colors
  primary: '#2196F3',
  secondary: '#666',

  // Background colors
  background: '#f5f5f5',
  white: '#ffffff',
  lightGray: '#f8f9fa',

  // Text colors
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#888',

  // Border and UI colors
  border: '#e5e7eb',
  unfilled: '#e5e7eb',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // QR Code background
  qrBackground: '#fff5f5',

  // Additional specific colors
  hotpRed: '#FF6B6B',
  black: '#000000',
  borderLight: '#e0e0e0',
  backgroundLight: '#fafafa',
  blue: '#3b82f6',
  blueLight: '#eff6ff',
  grayMedium: '#6b7280',
} as const;

export type ColorKeys = keyof typeof colors;
