import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileEditField } from '@/components/profileEdit/ProfileEditField';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditSection } from '@/components/profileEdit/ProfileEditSection';
import { Toast } from '@/components/Toast';
import { TopBar } from '@/components/TopBar';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useMyInfoQuery } from '@/queries/useMyInfoQuery';
import { useUpdateMyProfileMutation } from '@/queries/useProfileEditMutation';
import { profileEditSchema, type ProfileEditForm } from '@/schemas/profileEditSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatPhoneNumber } from '@/utils/phoneNumber';
import { getProfileEditErrorMessage } from '@/utils/profileEditError';
import { tokenStorage } from '@/utils/tokenStorage';

cssInterop(Image, { className: 'style' });

// 숫자만 입력해도 YYYY-MM-DD 형태로 하이픈을 넣어 줍니다.
function formatBirthDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export default function ProfileEditFormScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { data: myInfo } = useMyInfoQuery();
  const updateProfile = useUpdateMyProfileMutation();
  const isSavingRef = useRef(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onBlur',
    defaultValues: { password: '', passwordConfirm: '', birthDate: '' },
  });

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/my');
  };
  const handleToastHide = useCallback(() => setToastMessage(null), []);

  // 2차 보안을 설정한 회원만 연락처를 바꿀 수 있어, 미설정 시 2차 보안 설정 화면으로 보냅니다.
  const handleContactChangePress = () => {
    if (!myInfo) return;
    if (myInfo.twoFactorStatus !== 'ENABLED') {
      router.push({ pathname: '/two-factor-verify', params: { preview: 'required' } });
      return;
    }
    router.push('/profile-edit/phone');
  };

  const saveProfile = async ({ password, birthDate }: ProfileEditForm) => {
    if (!myInfo) return;
    // 입력한 항목만 보냅니다. 비워 둔 항목은 바꾸지 않습니다.
    const changes = {
      ...(password ? { password } : {}),
      ...(birthDate ? { birthDate } : {}),
    };
    if (Object.keys(changes).length === 0) {
      setToastMessage('수정할 정보를 입력해 주세요.');
      return;
    }
    try {
      const { reloginRequired } = await updateProfile.mutateAsync(changes);
      if (reloginRequired) {
        // 비밀번호를 바꾸면 서버가 모든 기기에서 로그아웃시키므로, 저장된 토큰을 지우고 다시 로그인하게 합니다.
        await tokenStorage.clear();
        useAuthStore.getState().setLoggedIn(false);
        router.dismissAll();
        router.replace('/login');
        return;
      }
      router.dismissTo('/(tabs)/my');
    } catch (error) {
      setToastMessage(getProfileEditErrorMessage(error));
    }
  };

  // 중복 저장을 막고, 입력값 검사를 통과했을 때만 저장합니다.
  const handleSave = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      await handleSubmit(saveProfile)();
    } finally {
      isSavingRef.current = false;
    }
  };

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
              value={myInfo?.loginId ?? ''}
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
              value={myInfo?.nickname ?? ''}
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
            <ProfileEditField label="이메일" value={myInfo?.email ?? ''} editable={false} />
            <View className="gap-[8px]">
              <ProfileEditField
                label="전화번호 (선택)"
                value={myInfo?.phoneNumber ? formatPhoneNumber(myInfo.phoneNumber) : ''}
                editable={false}
                placeholder="연락처 미등록"
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
        <ProfileEditFooter
          title="회원정보 수정하기"
          disabled={updateProfile.isPending}
          onPress={handleSave}
        />
      </KeyboardAvoidingView>
      <View pointerEvents="none" className="absolute inset-x-0 bottom-[104px]">
        <Toast message={toastMessage} onHide={handleToastHide} />
      </View>
    </SafeAreaView>
  );
}
