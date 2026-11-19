import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileEditField } from '@/components/profileEdit/ProfileEditField';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditSection } from '@/components/profileEdit/ProfileEditSection';
import { TopBar } from '@/components/TopBar';
import { PROFILE_EDIT_PREVIEW } from '@/constants/profileEditPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { profileEditSchema, type ProfileEditForm } from '@/schemas/profileEditSchema';

cssInterop(Image, { className: 'style' });

// 숫자만 입력해도 YYYY-MM-DD 형태로 하이픈을 넣어 줍니다.
function formatBirthDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

// 미리보기 주소: /profile-edit/form?preview=mismatch (비밀번호 불일치)
export default function ProfileEditFormScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const isMismatchPreview = preview === 'mismatch';
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { control, handleSubmit, trigger } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onBlur',
    defaultValues: {
      password: isMismatchPreview ? 'motu1234!' : '',
      passwordConfirm: isMismatchPreview ? 'motu123!' : '',
      birthDate: '',
    },
  });

  useEffect(() => {
    if (isMismatchPreview) trigger('passwordConfirm');
  }, [isMismatchPreview, trigger]);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/my');
  };

  // 퍼블리싱 단계: 검증만 통과하면 마이페이지로 돌아갑니다.
  // TODO: 회원정보 수정 API 연결 후 저장 성공 시에만 이동합니다.
  const handleSave = handleSubmit(() => router.dismissTo('/(tabs)/my'));
  const handleContactChangePress = () => router.push('/profile-edit/phone');
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="회원정보 수정" onBack={handleBack} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          contentContainerClassName="gap-[12px] px-[24px] pb-[24px]"
          showsVerticalScrollIndicator={false}
        >
          <ProfileEditSection title="계정 정보">
            <ProfileEditField
              label="아이디"
              value={PROFILE_EDIT_PREVIEW.loginId}
              editable={false}
              helperText="아이디는 변경할 수 없어요."
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <ProfileEditField
                  label="비밀번호"
                  isRequired
                  hasMessageSlot
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  maxLength={20}
                  placeholder="8~20자, 영문·숫자·특수문자 각 1개 이상"
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <ProfileEditField
                  label="비밀번호 확인"
                  isRequired
                  hasMessageSlot
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  maxLength={20}
                  placeholder="비밀번호를 다시 입력하세요."
                  errorMessage={error?.message}
                />
              )}
            />
          </ProfileEditSection>

          <ProfileEditSection title="개인 정보">
            <ProfileEditField
              label="닉네임"
              value={PROFILE_EDIT_PREVIEW.nickname}
              editable={false}
              helperText="닉네임은 변경할 수 없어요."
            />
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <ProfileEditField
                  label="생년월일"
                  isRequired
                  hasMessageSlot
                  value={value}
                  onChangeText={(text) => onChange(formatBirthDate(text))}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="YYYY-MM-DD"
                  errorMessage={error?.message}
                />
              )}
            />
          </ProfileEditSection>

          <ProfileEditSection title="연락처 정보">
            <ProfileEditField label="이메일" value={PROFILE_EDIT_PREVIEW.email} editable={false} />
            <View className="gap-[8px]">
              <ProfileEditField
                label="전화번호 (선택)"
                value={PROFILE_EDIT_PREVIEW.phoneNumber}
                editable={false}
              />
              <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey-light">
                연락처를 변경하려면 인증하세요.
              </Text>
              <Pressable
                accessibilityRole="link"
                hitSlop={8}
                onPress={handleContactChangePress}
                className="h-[18px] flex-row items-center gap-[4px] self-start active:opacity-60"
              >
                <Text className="font-pretendard-semibold text-[12px] leading-[18px] text-motu-black underline">
                  연락처 변경하러 가기
                </Text>
                <Image
                  source={require('../../assets/icons/listingApplication/metrics/chevronRight.svg')}
                  contentFit="contain"
                  className="h-[14px] w-[14px]"
                  accessible={false}
                />
              </Pressable>
            </View>
          </ProfileEditSection>
        </ScrollView>
        <ProfileEditFooter title="회원정보 수정하기" onPress={handleSave} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
