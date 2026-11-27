import { Text, View } from 'react-native';

type RegisteredPhoneFieldProps = { label: string; value: string };

// 읽기 전용 인증 번호는 입력창의 비활성 텍스트색과 달리 디자인의 보조 텍스트색을 사용합니다.
export function RegisteredPhoneField({ label, value }: RegisteredPhoneFieldProps) {
  return (
    <View className="gap-[8px]">
      <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
        {label}
      </Text>
      <View className="h-[50px] justify-center rounded-[12px] border border-motu-border bg-motu-border px-[15px]">
        <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-secondary text-no-font-padding">
          {value}
        </Text>
      </View>
    </View>
  );
}
