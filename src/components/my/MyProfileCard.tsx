import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type MyProfileCardProps = {
  nickname: string;
  email: string;
  maskedPhoneNumber: string;
  isSecondFactorEnabled: boolean;
  onEditPress?: () => void;
};

type InfoRowProps = {
  icon: number;
  text: string;
  textClassName?: string;
};

// 아이콘 + 한 줄 정보 (이메일, 전화번호, 2차 보안 상태)
function InfoRow({ icon, text, textClassName = 'text-motu-black' }: InfoRowProps) {
  return (
    <View className="h-[24px] flex-row items-center gap-[10px]">
      <View className="h-[24px] w-[24px] items-center justify-center rounded-[6px] bg-motu-grey-lighter/60">
        <Image
          source={icon}
          contentFit="contain"
          className="h-[13px] w-[13px]"
          accessible={false}
        />
      </View>
      <Text className={`font-pretendard text-[12.5px] leading-[18.75px] ${textClassName}`}>
        {text}
      </Text>
    </View>
  );
}

export function MyProfileCard({
  nickname,
  email,
  maskedPhoneNumber,
  isSecondFactorEnabled,
  onEditPress,
}: MyProfileCardProps) {
  return (
    <View className="rounded-[16px] border border-motu-grey-lighter bg-white p-[20px]">
      <View className="flex-row items-start gap-[12px]">
        <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-motu-black">
          <Text className="font-pretendard-bold text-[16px] leading-[24px] text-white">
            {nickname.charAt(0)}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          className="flex-1 font-pretendard-bold text-[15px] leading-[22.5px] text-motu-black"
        >
          {nickname} 님
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="회원정보 편집"
          onPress={onEditPress}
          className="h-[32px] flex-row items-center gap-[4px] rounded-[8px] border border-motu-grey-lighter px-[12px] active:opacity-60"
        >
          <Image
            source={require('../../../assets/icons/my/pencil.svg')}
            contentFit="contain"
            className="h-[13px] w-[13px]"
            accessible={false}
          />
          <Text className="font-pretendard-semibold text-[12px] leading-[18px] text-motu-black">
            편집
          </Text>
        </Pressable>
      </View>

      <View className="mt-[16px] gap-[10px] border-t border-motu-grey-lighter pt-[16px]">
        <InfoRow icon={require('../../../assets/icons/my/mail.svg')} text={email} />
        <InfoRow icon={require('../../../assets/icons/my/phone.svg')} text={maskedPhoneNumber} />
        <InfoRow
          icon={require('../../../assets/icons/my/shield.svg')}
          text={isSecondFactorEnabled ? '2차 보안 설정 완료' : '2차 보안 미설정'}
          textClassName={isSecondFactorEnabled ? 'text-motu-green' : 'text-motu-red'}
        />
      </View>
    </View>
  );
}
