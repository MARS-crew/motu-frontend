import { Pressable, Text, View } from 'react-native';

type NotificationPreferenceRowProps = {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  isDisabled?: boolean;
  isPrimary?: boolean;
};

export function NotificationPreferenceRow({
  title,
  description,
  isEnabled,
  onToggle,
  isDisabled = false,
  isPrimary = false,
}: NotificationPreferenceRowProps) {
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
        className={`h-[24px] w-[44px] shrink-0 justify-center rounded-full px-[2px] ${isEnabled ? 'items-end bg-motu-black' : 'items-start bg-motu-grey-light/60'} ${isDisabled ? 'opacity-40' : ''}`}
      >
        <View className="h-[20px] w-[20px] rounded-full bg-motu-surface-card" />
      </View>
    </Pressable>
  );
}
