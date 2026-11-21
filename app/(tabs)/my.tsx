import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { MyAccountActionModal, type MyAccountAction } from '@/components/my/MyAccountActionModal';
import { MyMenuGroup } from '@/components/my/MyMenuGroup';
import { MyMenuItem } from '@/components/my/MyMenuItem';
import { MyProfileCard } from '@/components/my/MyProfileCard';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useMyInfoQuery } from '@/queries/useMyInfoQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { maskPhoneNumber } from '@/utils/phoneNumber';

export default function MyScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [accountAction, setAccountAction] = useState<MyAccountAction | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data: myInfo, isPending } = useMyInfoQuery();
  const isSecondFactorEnabled = myInfo?.twoFactorStatus === 'ENABLED';

  // 퍼블리싱 단계: 아직 화면이 없는 메뉴(1:1 문의)는 담당 화면이 생기면 연결합니다.
  const handleEditPress = () => router.push('/profile-edit');
  const handleNoticePress = () => router.push('/notice');
  const handleListingApplicationPress = () => router.push('/listing-application');
  const handleCloseAccountAction = () => setAccountAction(null);

  // 비로그인 → 로그인 안내, 불러오는 중 → 로딩, 실패 → 안내 문구 순서로 보여 줍니다.
  const renderProfile = () => {
    if (!isLoggedIn) return <LoginRequiredBox />;
    if (isPending) return <ActivityIndicator className="py-10" />;
    if (!myInfo) {
      return (
        <Text className="py-10 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          회원 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      );
    }

    return (
      <MyProfileCard
        nickname={myInfo.nickname}
        email={myInfo.email}
        maskedPhoneNumber={
          myInfo.phoneNumber ? maskPhoneNumber(myInfo.phoneNumber) : '연락처 미등록'
        }
        isSecondFactorEnabled={isSecondFactorEnabled}
        onEditPress={handleEditPress}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <View
        className={`border-b bg-motu-bg px-6 pb-4 pt-8 ${isScrolled ? 'border-motu-grey-lighter' : 'border-transparent'}`}
      >
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black"
        >
          마이페이지
        </Text>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-[24px] pt-[4px]"
        showsVerticalScrollIndicator={false}
      >
        {renderProfile()}

        <View className="mt-[24px] gap-[12px]">
          <MyMenuGroup>
            <MyMenuItem
              icon={require('../../assets/icons/my/shieldCheck.svg')}
              title={isSecondFactorEnabled ? '2차 보안 관리' : '2차 보안 설정하기'}
              description="여기서 2차 보안을 설정하거나 해제할 수 있어요."
              onPress={() => router.push('/two-factor-security')}
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/bell.svg')}
              title="알림 설정"
              hasDivider
              onPress={() => router.push('/notification-settings')}
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/megaphone.svg')}
              title="공지사항 및 FAQ"
              hasDivider
              onPress={handleNoticePress}
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/message.svg')}
              title="1:1 문의"
              hasDivider
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/fileText.svg')}
              title="상장 신청"
              hasDivider
              onPress={handleListingApplicationPress}
            />
          </MyMenuGroup>

          <MyMenuGroup>
            <MyMenuItem
              icon={require('../../assets/icons/my/logout.svg')}
              title="로그아웃"
              hasChevron={false}
              onPress={() => setAccountAction('logout')}
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/userMinus.svg')}
              title="회원탈퇴"
              tone="danger"
              hasChevron={false}
              hasDivider
              onPress={() => setAccountAction('withdraw')}
            />
          </MyMenuGroup>
        </View>
      </ScrollView>
      {accountAction && (
        <MyAccountActionModal action={accountAction} onClose={handleCloseAccountAction} />
      )}
    </SafeAreaView>
  );
}
