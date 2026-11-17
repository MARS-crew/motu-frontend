import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

import { getPasswordRules } from '@/schemas/signupInfoSchema';

cssInterop(Image, { className: 'style' });

type PasswordChecklistProps = {
  password: string;
  confirmation: string;
};

export function PasswordChecklist({ password, confirmation }: PasswordChecklistProps) {
  const rules = [
    ...getPasswordRules(password),
    {
      label: '비밀번호 확인값과 동일',
      isMet: password !== '' && password === confirmation,
    },
  ];

  return (
    <View className="gap-[8px] rounded-[14px] bg-motu-surface-card p-[16px]">
      <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
        비밀번호 입력 조건
      </Text>
      {rules.map(({ label, isMet }) => (
        <View key={label} className="flex-row items-center gap-[6px]">
          <Image
            source={
              isMet
                ? require('../../../assets/icons/signup/passwordCheck.svg')
                : require('../../../assets/icons/signup/passwordInvalid.svg')
            }
            className="h-[14px] w-[14px]"
            contentFit="contain"
            accessible={false}
          />
          <Text
            accessibilityLabel={`${label}, ${isMet ? '충족' : '미충족'}`}
            className={`font-pretendard-medium text-[13px] leading-[18px] text-no-font-padding ${isMet ? 'text-motu-success' : 'text-motu-btn-red'}`}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
