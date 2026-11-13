import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useCallback, useState } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import { TermsDetail } from '@/components/signup/TermsDetail';
import { SIGNUP_TERMS, type SignupTerm } from '@/constants/signupTerms';

cssInterop(Image, { className: 'style' });

const REQUIRED_TERMS = ['service', 'privacy'] as const satisfies readonly SignupTerm[];

type TermCheckmarkProps = {
  isChecked: boolean;
};

function TermCheckmark({ isChecked }: TermCheckmarkProps) {
  return (
    <View
      className={`h-[22px] w-[22px] items-center justify-center rounded-[6px] border border-motu-border ${isChecked ? 'bg-motu-success' : 'bg-motu-bg'}`}
    >
      <Image
        source={require('../../assets/icons/signup/check.svg')}
        className="h-[14px] w-[14px]"
        contentFit="contain"
        accessible={false}
      />
    </View>
  );
}

export default function SignupScreen() {
  const [consent, setConsent] = useState<Record<SignupTerm, boolean>>({
    service: false,
    privacy: false,
  });
  const [detail, setDetail] = useState<SignupTerm | null>(null);
  const isAllChecked = REQUIRED_TERMS.every((term) => consent[term]);

  const handleCloseDetail = useCallback(() => setDetail(null), []);
  useFocusEffect(
    useCallback(() => {
      if (!detail) return;
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleCloseDetail();
        return true;
      });
      return () => subscription.remove();
    }, [detail, handleCloseDetail]),
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  };
  const handleToggleAll = () => {
    setConsent({ service: !isAllChecked, privacy: !isAllChecked });
  };
  const handleToggleTerm = (term: SignupTerm) => {
    setConsent((current) => ({ ...current, [term]: !current[term] }));
  };
  const handleAgree = (term: SignupTerm) => {
    setConsent((current) => ({ ...current, [term]: true }));
    handleCloseDetail();
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      {detail ? (
        <TermsDetail
          key={detail}
          term={detail}
          onClose={handleCloseDetail}
          onAgree={() => handleAgree(detail)}
        />
      ) : (
        <>
          <LoginHeader title="회원가입" onBack={handleBack} />
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow gap-[24px] px-[24px] pb-[32px] pt-[12px]"
          >
            <View
              accessibilityRole="progressbar"
              accessibilityLabel="회원가입 1단계"
              accessibilityValue={{ min: 0, now: 1, max: 4 }}
              className="flex-row items-center gap-[6px]"
            >
              {[1, 2, 3, 4].map((step) => (
                <View
                  key={step}
                  className={`h-[4px] flex-1 rounded-full ${step === 1 ? 'bg-motu-black' : 'bg-motu-border'}`}
                />
              ))}
              <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary text-no-font-padding">
                1/4
              </Text>
            </View>
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
            >
              약관에 동의해 주세요.
            </Text>
            <View className="gap-[10px]">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="전체 동의"
                accessibilityState={{ checked: isAllChecked }}
                onPress={handleToggleAll}
                className="min-h-[54px] flex-row items-center gap-[12px] rounded-auth-input bg-motu-bg-secondary px-[16px]"
              >
                <TermCheckmark isChecked={isAllChecked} />
                <Text className="font-pretendard-bold text-[15px] leading-[20px] text-motu-text-primary text-no-font-padding">
                  전체 동의
                </Text>
              </Pressable>
              {REQUIRED_TERMS.map((term) => (
                <View
                  key={term}
                  className="min-h-[54px] flex-row rounded-auth-input border border-motu-border bg-motu-surface-card"
                >
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={SIGNUP_TERMS[term].label}
                    accessibilityState={{ checked: consent[term] }}
                    onPress={() => handleToggleTerm(term)}
                    className="justify-center pl-[15px]"
                  >
                    <TermCheckmark isChecked={consent[term]} />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${SIGNUP_TERMS[term].title} 보기`}
                    onPress={() => setDetail(term)}
                    className="flex-1 flex-row items-center gap-[12px] py-[15px] pl-[12px] pr-[14px]"
                  >
                    <Text className="flex-1 font-pretendard-medium text-[14px] leading-[20px] text-motu-text-primary text-no-font-padding">
                      {SIGNUP_TERMS[term].label}
                    </Text>
                    <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-btn-red text-no-font-padding">
                      필수
                    </Text>
                    <Image
                      source={require('../../assets/icons/signup/chevron.svg')}
                      className="h-[14px] w-[8px] rotate-180"
                      contentFit="contain"
                      accessible={false}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
            <View className="min-h-px flex-1" />
            <Button appearance="auth" title="다음" disabled={!isAllChecked} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
