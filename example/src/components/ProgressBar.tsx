import { useEffect } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 1
  width?: number | null;
  height?: number;
  color?: string;
  unfilledColor?: string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  width = null,
  height = 6,
  color = '#3b82f6',
  unfilledColor = '#e5e7eb',
  borderRadius = 3,
  style,
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 200,
    });
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const widthPercentage = interpolate(
      animatedProgress.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width: `${widthPercentage}%`,
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: unfilledColor,
          borderRadius,
          width: width || '100%',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          animatedStyle,
          {
            backgroundColor: color,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
