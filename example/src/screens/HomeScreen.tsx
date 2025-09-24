import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  TOTP: undefined;
  HOTP: undefined;
  TimeZones: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuDescription}>{description}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const menuItems = [
    {
      title: 'TOTP Generator',
      description: 'Generate time-based one-time passwords',
      icon: '🕐',
      screen: 'TOTP' as const,
    },
    {
      title: 'HOTP Generator',
      description: 'Generate counter-based one-time passwords',
      icon: '🔢',
      screen: 'HOTP' as const,
    },
    {
      title: 'Time Zones',
      description: 'Test OTP generation across different time zones',
      icon: '🌍',
      screen: 'TimeZones' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🔐 NitroTotp</Text>
          <Text style={styles.subtitle}>
            Secure OTP generation powered by Nitro Modules
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.screen}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  chevron: {
    fontSize: 24,
    color: '#d1d5db',
    fontWeight: '300',
  },
});
