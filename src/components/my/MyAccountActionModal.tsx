import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  WITHDRAWAL_REASON_MAX_LENGTH,
  withdrawalSchema,
  type WithdrawalForm,
} from '@/schemas/withdrawalSchema';

export type MyAccountAction = 'logout' | 'withdraw';

type MyAccountActionModalProps = {
  action: MyAccountAction;
  onClose: () => void;
};

export function MyAccountActionModal({ action, onClose }: MyAccountActionModalProps) {
  const { control, handleSubmit } = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { reason: '' },
  });
  const isWithdrawal = action === 'withdraw';
  const actionLabel = isWithdrawal ? '회원탈퇴' : '로그아웃';
  const handleConfirm = isWithdrawal ? handleSubmit(onClose) : onClose;

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-motu-overlay/40"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow items-center justify-center px-[28px] py-[12px]"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessible={false}
            importantForAccessibility="no"
            onPress={onClose}
            className="absolute inset-0"
          />
          <View
            accessibilityViewIsModal
            className="w-full max-w-[320px] rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card p-[25px]"
          >
            <Text
              accessibilityRole="header"
              className="text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-black text-no-font-padding"
            >
              {actionLabel} 하시겠습니까?
            </Text>

            <View className="mt-[12px]">
              <Text className="-mx-[16px] text-center font-pretendard text-[12.5px] leading-[20.313px] text-motu-grey text-no-font-padding">
                {isWithdrawal
                  ? '탈퇴 시 보유 포인트는 소멸하고 미체결 주문은 취소됩니다.'
                  : '로그아웃하면 현재 로그인 세션이 종료돼요.'}
              </Text>
              {isWithdrawal && (
                <Text className="-mx-[16px] mt-[2px] text-center font-pretendard text-[12.5px] leading-[20.313px] text-motu-grey text-no-font-padding">
                  {
                    '탈퇴 후 서비스 이용 및 기록 조회가 불가능하며,\n일부 정보는 보유 정책에 따라 일정 기간 보관됩니다.'
                  }
                </Text>
              )}
            </View>

            {isWithdrawal && (
              <View className="mt-[20px]">
                <Text className="mb-[8px] font-pretendard-semibold text-[12.5px] leading-[18.75px] text-motu-black text-no-font-padding">
                  탈퇴 사유 <Text className="text-motu-red">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field: { onBlur, onChange, ref, value }, fieldState: { error } }) => (
                    <>
                      <TextInput
                        ref={ref}
                        accessibilityLabel="탈퇴 사유 (필수)"
                        placeholder="탈퇴 사유를 입력해 주세요."
                        maxLength={WITHDRAWAL_REASON_MAX_LENGTH}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        className={`h-[45.5px] rounded-[12px] border px-[16px] py-0 font-pretendard text-[13px] leading-[19.5px] text-motu-black outline-none text-no-font-padding text-vertical-center placeholder:font-pretendard-medium placeholder:text-motu-grey-light ${error ? 'border-motu-red' : 'border-motu-grey-lighter'}`}
                      />
                      <View className="min-h-[20px] flex-row items-center justify-end gap-[8px]">
                        {error && (
                          <Text
                            accessibilityLiveRegion="polite"
                            className="flex-1 font-pretendard text-[12px] leading-[19.5px] text-motu-red text-no-font-padding"
                          >
                            {error.message}
                          </Text>
                        )}
                        <Text className="font-pretendard-medium text-[12px] leading-[19.5px] text-motu-grey-light text-no-font-padding">
                          {value.length}/{WITHDRAWAL_REASON_MAX_LENGTH}
                        </Text>
                      </View>
                    </>
                  )}
                />
              </View>
            )}

            <View className="mt-[24px] flex-row gap-[8px]">
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                className="h-[45.5px] flex-1 items-center justify-center rounded-[8px] border border-motu-grey-lighter active:opacity-80"
              >
                <Text className="font-pretendard-semibold text-[13px] leading-[19.5px] text-motu-black text-no-font-padding">
                  취소
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleConfirm}
                className={`h-[45.5px] flex-1 items-center justify-center rounded-[8px] active:opacity-80 ${isWithdrawal ? 'bg-motu-btn-red' : 'bg-motu-black'}`}
              >
                <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-on-cta text-no-font-padding">
                  {actionLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
