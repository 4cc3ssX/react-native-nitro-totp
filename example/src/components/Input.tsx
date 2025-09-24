import { TextInput, StyleSheet, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {}

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#374151',
  },
});
