import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import { SIGNUP_TERMS, type SignupTerm } from '@/constants/signupTerms';

type TermsDetailProps = {
  term: SignupTerm;
  onClose: () => void;
  onAgree: () => void;
};

const BODY_TEXT =
  'font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding';

export function TermsDetail({ term, onClose, onAgree }: TermsDetailProps) {
  const { title, sections } = SIGNUP_TERMS[term];

  return (
    <>
      <LoginHeader title={title} onBack={onClose} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-[20px] px-[24px] pb-[32px] pt-[12px]"
      >
        <View className="self-start rounded-full bg-motu-red-light px-[12px] py-[6px]">
          <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-btn-red text-no-font-padding">
            필수
          </Text>
        </View>
        {term === 'privacy' && (
          <View className="gap-[8px] rounded-[14px] bg-motu-surface-card p-[16px]">
            <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
              목차
            </Text>
            {sections.map(([heading], index) => (
              <Text key={heading} className={BODY_TEXT}>
                {index === 4 ? '5. 동의 거부 시 불이익' : heading}
              </Text>
            ))}
          </View>
        )}
        <View className="gap-[16px] rounded-[14px] bg-motu-surface-card px-[16px] py-[18px]">
          {sections.map(([heading, description]) => (
            <View key={heading} className="gap-[6px]">
              <Text
                accessibilityRole="header"
                className="font-pretendard-bold text-[15px] leading-[20px] text-motu-text-primary text-no-font-padding"
              >
                {heading}
              </Text>
              <Text className={BODY_TEXT}>{description}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row gap-[10px]">
          <View className="flex-1">
            <Button appearance="auth" title="닫기" variant="secondary" onPress={onClose} />
          </View>
          <View className="flex-1">
            <Button appearance="auth" title="동의" onPress={onAgree} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
