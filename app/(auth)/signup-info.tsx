import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Keyboard,
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
import {
  DuplicateCheckModal,
  type DuplicateCheckResult,
} from '@/components/signup/DuplicateCheckModal';
import { PasswordChecklist } from '@/components/signup/PasswordChecklist';
import { SignupProgress } from '@/components/signup/SignupProgress';
import { TextField } from '@/components/TextField';
import {
  signupIdSchema,
  signupInfoSchema,
  signupNicknameSchema,
  type SignupInfoForm,
} from '@/schemas/signupInfoSchema';

import { formatBirthDateInput } from '@/utils/formatDate';
import { signupConsentSchema } from '@/schemas/signupConsentSchema';
import { useSignupFormStore } from '@/stores/useSignupFormStore';
import { useSignupAvailabilityQuery } from '@/queries/useSignupAvailabilityQuery';

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
  { name: 'birthDate', label: '생년월일 *', placeholder: 'YYYY-MM-DD', inputMode: 'numeric' },
];

const DUPLICATE_CHECK_SCHEMAS = { loginId: signupIdSchema, nickname: signupNicknameSchema };

export default function SignupInfoScreen() {
  const consent = useSignupFormStore((state) => state.consent);
  const savedInfo = useSignupFormStore((state) => state.info);
  const setInfo = useSignupFormStore((state) => state.setInfo);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateCheckResult | null>(null);
  const [acceptedValues, setAcceptedValues] = useState({ loginId: '', nickname: '' });
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const { control, formState, handleSubmit, getValues } = useForm<SignupInfoForm>({
    resolver: zodResolver(signupInfoSchema),
    mode: 'onChange',
    defaultValues: savedInfo ?? {
      loginId: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  });
  const [password, confirmation, loginId, nickname] = useWatch({
    control,
    name: ['password', 'confirmPassword', 'loginId', 'nickname'],
  });
  const loginIdQuery = useSignupAvailabilityQuery('loginId', loginId);
  const nicknameQuery = useSignupAvailabilityQuery('nickname', nickname);
  const duplicateQueries = { loginId: loginIdQuery, nickname: nicknameQuery };
  const handleCheckDuplicate = async (field: DuplicateCheckResult['field'], value: string) => {
    const query = duplicateQueries[field];
    if (
      query.checkedValue !== value ||
      query.isFetching ||
      !DUPLICATE_CHECK_SCHEMAS[field].safeParse(value).success
    )
      return;
    Keyboard.dismiss();
    const response = await query.refetch();
    if (getValues(field) === value && response.data?.available && !response.error)
      setDuplicateResult({ field, value });
  };
  const handleCloseDuplicate = () => setDuplicateResult(null);
  const handleAcceptDuplicate = () => {
    if (!duplicateResult) return;
    const { field, value } = duplicateResult;
    if (getValues(field) !== value) {
      handleCloseDuplicate();
      return;
    }
    setAcceptedValues((current) => ({ ...current, [field]: value }));
    handleCloseDuplicate();
  };
  const { errors, touchedFields, isValid } = formState;
  const hasCheckedDuplicates =
    acceptedValues.loginId === loginId &&
    acceptedValues.nickname === nickname &&
    loginIdQuery.data?.available === true &&
    nicknameQuery.data?.available === true &&
    !loginIdQuery.error &&
    !nicknameQuery.error &&
    loginIdQuery.checkedValue === loginId &&
    nicknameQuery.checkedValue === nickname;
  const hasMismatch = confirmation !== '' && password !== confirmation;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/signup');
  };

  if (!signupConsentSchema.safeParse(consent).success) return <Redirect href="/signup" />;

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
          <SignupProgress step={2} />
          <View className="gap-[6px]">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
            >
              기본 정보를 입력해 주세요.
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
              아이디와 닉네임의 중복 확인을 해 주세요.
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
                    rules={{ deps: name === 'password' ? ['confirmPassword'] : undefined }}
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <TextField
                        variant="auth"
                        label={label}
                        inputRef={ref}
                        value={value}
                        onChangeText={(text) => {
                          onChange(name === 'birthDate' ? formatBirthDateInput(text) : text);
                          if (hasDuplicateAction)
                            setAcceptedValues((current) =>
                              current[name] ? { ...current, [name]: '' } : current,
                            );
                        }}
                        onBlur={onBlur}
                        inputMode={inputMode}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={placeholder}
                        secureTextEntry={isPassword && !isPasswordVisible}
                        helperText={helperText}
                        isInvalid={
                          hasDuplicateAction &&
                          duplicateQueries[name].checkedValue === value &&
                          duplicateQueries[name].data?.available === false
                        }
                        messageSize={name === 'confirmPassword' ? 'double' : 'single'}
                        errorMessage={
                          name === 'confirmPassword' && hasMismatch
                            ? '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.'
                            : touchedFields[name] || (name === 'password' && value !== '')
                              ? errors[name]?.message
                              : undefined
                        }
                        inputAction={
                          hasDuplicateAction ? (
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`${label.replace(' *', '')} 중복 확인`}
                              accessibilityState={{
                                selected:
                                  acceptedValues[name] !== '' && acceptedValues[name] === value,
                              }}
                              disabled={
                                duplicateQueries[name].isFetching ||
                                duplicateQueries[name].checkedValue !== value ||
                                !DUPLICATE_CHECK_SCHEMAS[name].safeParse(value).success
                              }
                              onPress={() => handleCheckDuplicate(name, value)}
                              className="h-[50px] justify-center rounded-auth-input bg-motu-tonal px-[14px]"
                            >
                              <Text className="font-pretendard-semibold text-[12px] leading-[16px] text-motu-text-primary text-no-font-padding">
                                중복 확인
                              </Text>
                            </Pressable>
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
                  {name === 'password' && (
                    <PasswordChecklist password={password} confirmation={confirmation} />
                  )}
                </View>
              );
            })}
          </View>
          <Button
            appearance="auth"
            title="다음"
            disabled={!isValid || !hasCheckedDuplicates}
            onPress={handleSubmit((form) => {
              if (!hasCheckedDuplicates) return;
              setInfo(form);
              router.push('/signup-email');
            })}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {duplicateResult && (
        <DuplicateCheckModal
          result={duplicateResult}
          onClose={handleCloseDuplicate}
          onAccept={handleAcceptDuplicate}
        />
      )}
    </SafeAreaView>
  );
}
