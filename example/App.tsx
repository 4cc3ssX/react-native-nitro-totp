import React, {useEffect} from 'react';

import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {
  formatOTP,
  formatSecretKey,
  isSecretKeyValid,
  NitroSecret,
  NitroTotp,
  parseSecretKey,
} from 'react-native-nitro-totp';
import {useTimer} from 'react-timer-hook';
import dayjs from 'dayjs';

export default function App() {
  const [secretKey, setSecretKey] = React.useState<string>('');
  const [otp, setOTP] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);

  const {seconds, restart} = useTimer({
    autoStart: true,
    expiryTimestamp: dayjs().add(30, 'seconds').toDate(),
    onExpire: () => onGenerateNewOTP(),
  });

  const onGenerateNewOTP = () => {
    const secret = parseSecretKey(secretKey);
    const generateOTP = NitroTotp.generate(secret);
    const valid = NitroTotp.validate(secret, generateOTP);
    setOTP(formatOTP(generateOTP));
    setIsValid(valid);

    restart(dayjs().add(30, 'seconds').toDate());
  };

  const onPressGenerateSecretKey = () => {
    const secret = NitroSecret.generate();
    setSecretKey(formatSecretKey(secret));

    onGenerateNewOTP();
  };

  const onChangeSecretKey = (text: string) => {
    if (isSecretKeyValid(text)) {
      setSecretKey(text);
    }
  };

  useEffect(() => {
    // generate secret key
    const secret = 'JRAQ465DVY4J4AP6CIFQ';

    setSecretKey(formatSecretKey(secret));

    onGenerateNewOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ABCD-ABCD-ABCD-ABCD-ABCD"
        value={secretKey}
        onChangeText={onChangeSecretKey}
        style={styles.input}
      />
      <Text>OTP: {otp}</Text>
      <Text>Expire in: {seconds}</Text>
      <Text>Is Valid: {`${isValid}`}</Text>
      <Button title="Generate Secret Key" onPress={onPressGenerateSecretKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});
