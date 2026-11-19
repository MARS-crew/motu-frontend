import { Text, View } from 'react-native';

type SignupProgressProps = {
  step: 1 | 2 | 3 | 4;
};

export function SignupProgress({ step }: SignupProgressProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`회원가입 ${step}단계`}
      accessibilityValue={{ min: 0, now: step, max: 4 }}
      className="flex-row items-center gap-[6px]"
    >
      {[1, 2, 3, 4].map((segment) => (
        <View
          key={segment}
          className={`h-[4px] flex-1 rounded-full ${segment <= step ? 'bg-motu-black' : 'bg-motu-border'}`}
        />
      ))}
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary text-no-font-padding">
        {step}/4
      </Text>
    </View>
  );
}
