import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, TextInput, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type OrderStepperProps = {
  label: string;
  unit: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

type StepButtonProps = {
  accessibilityLabel: string;
  icon: number;
  onPress: () => void;
};

function StepButton({ accessibilityLabel, icon, onPress }: StepButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={4}
      className="h-8 w-8 items-center justify-center rounded-full border border-motu-grey-lighter active:opacity-60"
    >
      <Image source={icon} contentFit="contain" className="h-4 w-4" accessible={false} />
    </Pressable>
  );
}

// 피그마 기준 왼쪽이 +, 오른쪽이 - 버튼입니다.
export function OrderStepper({
  label,
  unit,
  value,
  onChangeText,
  onBlur,
  onIncrease,
  onDecrease,
}: OrderStepperProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-pretendard-medium text-sm leading-[21px] text-motu-black">{label}</Text>
      <View className="flex-row items-center gap-2">
        <StepButton
          accessibilityLabel={`${label} 올리기`}
          icon={require('../../../assets/icons/order/plus.svg')}
          onPress={onIncrease}
        />
        <View className="h-[40.5px] w-28 flex-row items-center justify-center gap-0.5 rounded-lg border border-motu-grey-lighter px-[13px]">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            keyboardType="number-pad"
            accessibilityLabel={label}
            className="h-full min-w-0 flex-shrink py-0 text-right font-pretendard-semibold text-[15px] text-motu-black outline-none text-no-font-padding"
          />
          <Text className="font-pretendard text-[13px] leading-[19.5px] text-motu-grey">
            {unit}
          </Text>
        </View>
        <StepButton
          accessibilityLabel={`${label} 내리기`}
          icon={require('../../../assets/icons/order/minus.svg')}
          onPress={onDecrease}
        />
      </View>
    </View>
  );
}
