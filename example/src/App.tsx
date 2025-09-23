import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import TOTPScreen from './screens/TOTPScreen';
import HOTPScreen from './screens/HOTPScreen';
import TimeZonesScreen from './screens/TimeZonesScreen';

export type RootStackParamList = {
  Home: undefined;
  TOTP: undefined;
  HOTP: undefined;
  TimeZones: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3b82f6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'NitroTotp',
              headerTitle: '🔐 NitroTotp',
            }}
          />
          <Stack.Screen
            name="TOTP"
            component={TOTPScreen}
            options={{ title: 'TOTP Generator' }}
          />
          <Stack.Screen
            name="HOTP"
            component={HOTPScreen}
            options={{ title: 'HOTP Generator' }}
          />
          <Stack.Screen
            name="TimeZones"
            component={TimeZonesScreen}
            options={{ title: 'Time Zones' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
