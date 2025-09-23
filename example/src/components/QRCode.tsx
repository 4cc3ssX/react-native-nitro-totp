import { View, StyleSheet } from 'react-native';
import QRCodeComponent from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  style?: any;
}

export function QRCode({
  value,
  size = 200,
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  style,
}: QRCodeProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <QRCodeComponent
        value={value}
        size={size}
        bgColor={backgroundColor}
        fgColor={foregroundColor}
        level="M"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
});
