import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import { PasswordChecklist } from '@/components/signup/PasswordChecklist';
import { TextField } from '@/components/TextField';
import { signupInfoSchema, type SignupInfoForm } from '@/schemas/signupInfoSchema';

type SignupField = {
  name: keyof SignupInfoForm;
  label: string;
  helperText?: string;
  placeholder?: string;
  inputMode?: TextInputProps['inputMode'];
};

const SIGNUP_FIELDS: readonly SignupField[] = [
  { name: 'loginId', label: '아이디 *', helperText: '영문 소문자·숫자 5~20자' },
  { name: 'password', label: '비밀번호 *', helperText: '8~20자, 영문·숫자·특수문자 각 1자 이상' },
  { name: 'confirmPassword', label: '비밀번호 확인 *' },
  { name: 'nickname', label: '닉네임 *', helperText: '한글·영문·숫자 2~10자' },
  { name: 'email', label: '이메일 *', inputMode: 'email' },
  { name: 'phone', label: '휴대폰 번호(선택)', placeholder: '010-0000-0000', inputMode: 'tel' },
  { name: 'birthDate', label: '생년월일 *', placeholder: 'YYYY-MM-DD' },
];

export default function SignupInfoScreen() {
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const { control, formState } = useForm<SignupInfoForm>({
    resolver: zodResolver(signupInfoSchema),
    mode: 'onTouched',
    defaultValues: {
      loginId: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  });
  const [password, confirmation] = useWatch({ control, name: ['password', 'confirmPassword'] });
  const { errors, touchedFields, isValid } = formState;
  const hasMismatch =
    touchedFields.confirmPassword && confirmation !== '' && password !== confirmation;
  const showChecklist = Boolean((touchedFields.password && errors.password) || hasMismatch);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/signup');
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginHeader title="회원가입" onBack={handleBack} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow gap-[24px] px-[24px] pb-[32px] pt-[12px]"
          keyboardShouldPersistTaps="handled"
        >
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="회원가입 2단계"
            accessibilityValue={{ min: 0, now: 2, max: 4 }}
            className="flex-row items-center gap-[6px]"
          >
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                className={`h-[4px] flex-1 rounded-full ${step <= 2 ? 'bg-motu-black' : 'bg-motu-border'}`}
              />
            ))}
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary text-no-font-padding">
              2/4
            </Text>
          </View>
          <View className="gap-[6px]">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
            >
              기본 정보를 입력해 주세요.
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
              아이디와 닉네임은 중복 확인이 필요합니다.
            </Text>
          </View>
          <View className="gap-[16px]">
            {SIGNUP_FIELDS.map(({ name, label, inputMode, placeholder, helperText }) => {
              const isPassword = name === 'password' || name === 'confirmPassword';
              const hasDuplicateAction = name === 'loginId' || name === 'nickname';
              const isPasswordVisible = isPassword && visiblePasswords[name];

              return (
                <View key={name} className="gap-[8px]">
                  <Controller
                    control={control}
                    name={name}
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <TextField
                        variant="auth"
                        label={label}
                        inputRef={ref}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        inputMode={inputMode}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={placeholder}
                        secureTextEntry={isPassword && !isPasswordVisible}
                        helperText={helperText}
                        errorMessage={
                          name === 'confirmPassword' && hasMismatch
                            ? '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.'
                            : touchedFields[name]
                              ? errors[name]?.message
                              : undefined
                        }
                        inputAction={
                          hasDuplicateAction ? (
                            <View className="h-[50px] justify-center rounded-auth-input bg-motu-tonal px-[14px]">
                              <Text className="font-pretendard-semibold text-[12px] leading-[16px] text-motu-text-primary text-no-font-padding">
                                중복 확인
                              </Text>
                            </View>
                          ) : undefined
                        }
                        inputEndAccessory={
                          isPassword ? (
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`${label.replace(' *', '')} ${isPasswordVisible ? '숨기기' : '보기'}`}
                              onPress={() =>
                                setVisiblePasswords((current) => ({
                                  ...current,
                                  [name]: !current[name],
                                }))
                              }
                              className="h-full justify-center px-[16px]"
                            >
                              <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
                                {isPasswordVisible ? '숨기기' : '보기'}
                              </Text>
                            </Pressable>
                          ) : undefined
                        }
                      />
                    )}
                  />
                  {name === 'password' && showChecklist && (
                    <PasswordChecklist password={password} confirmation={confirmation} />
                  )}
                </View>
              );
            })}
          </View>
          <Button appearance="auth" title="다음" disabled={!isValid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
