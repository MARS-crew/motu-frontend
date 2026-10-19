import { Text, View } from 'react-native';

type ListingFormStepperProps = { step: number };

export function ListingFormStepper({ step }: ListingFormStepperProps) {
  return (
    <View
      accessibilityLabel={`신청서 작성 4단계 중 ${step}단계`}
      className="h-[14px] flex-row items-center gap-1.5"
    >
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          className={`h-1 flex-1 rounded-full ${item <= step ? 'bg-motu-black' : 'bg-motu-border'}`}
        />
      ))}
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary">
        {step}/4
      </Text>
    </View>
  );
}
