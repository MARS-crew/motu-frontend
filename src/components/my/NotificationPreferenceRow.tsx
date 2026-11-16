import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type NotificationPreferenceRowProps = {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  isDisabled?: boolean;
  isPrimary?: boolean;
};

const THUMB_TRAVEL = 20;
const TOGGLE_DURATION_MS = 180;

export function NotificationPreferenceRow({
  title,
  description,
  isEnabled,
  onToggle,
  isDisabled = false,
  isPrimary = false,
}: NotificationPreferenceRowProps) {
  const progress = useSharedValue(isEnabled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isEnabled ? 1 : 0, {
      duration: TOGGLE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [isEnabled, progress]);

  const trackStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityState={{ checked: isEnabled, disabled: isDisabled }}
      aria-checked={isEnabled}
      disabled={isDisabled}
      onPress={onToggle}
      className={`flex-row items-center justify-between gap-[12px] px-[16px] ${isPrimary ? 'min-h-[95px]' : 'min-h-[74px] border-t border-motu-grey-lighter'}`}
    >
      <View className={`min-w-0 flex-1 py-[12px] ${isPrimary ? 'gap-[14px]' : 'gap-[4px]'}`}>
        <Text className="font-pretendard-semibold text-[13.5px] leading-[20.25px] text-motu-black text-no-font-padding">
          {title}
        </Text>
        <Text className="font-pretendard text-[11.5px] leading-[17.25px] text-motu-grey text-no-font-padding">
          {description}
        </Text>
      </View>
      <View
        className={`relative h-[24px] w-[44px] shrink-0 justify-center overflow-hidden rounded-full bg-motu-grey-light/60 px-[2px] ${isDisabled ? 'opacity-40' : ''}`}
      >
        <View className="absolute inset-0" pointerEvents="none">
          <Animated.View style={trackStyle}>
            <View className="h-[24px] rounded-full bg-motu-black" />
          </Animated.View>
        </View>
        <Animated.View style={thumbStyle}>
          <View className="h-[20px] w-[20px] rounded-full bg-motu-surface-card" />
        </Animated.View>
      </View>
    </Pressable>
  );
}
