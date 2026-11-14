import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyMenuGroup } from '@/components/my/MyMenuGroup';
import { MyMenuItem } from '@/components/my/MyMenuItem';
import { MyProfileCard } from '@/components/my/MyProfileCard';
import { MY_PAGE_PREVIEW } from '@/constants/myPagePreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function MyScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const profile = MY_PAGE_PREVIEW;

  // 퍼블리싱 단계: 아직 화면이 없는 메뉴(편집, 2차 보안, 알림 설정, 1:1 문의, 로그아웃, 회원탈퇴)는
  // 담당 화면이 생기면 연결합니다.
  const handleNoticePress = () => router.push('/notice');
  const handleListingApplicationPress = () => router.push('/listing-application');

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
        <MyProfileCard
          nickname={profile.nickname}
          email={profile.email}
          maskedPhoneNumber={profile.maskedPhoneNumber}
          isSecondFactorEnabled={profile.isSecondFactorEnabled}
        />

        <View className="mt-[24px] gap-[12px]">
          <MyMenuGroup>
            <MyMenuItem
              icon={require('../../assets/icons/my/shieldCheck.svg')}
              title={profile.isSecondFactorEnabled ? '2차 보안 관리' : '2차 보안 설정하기'}
              description="여기서 2차 보안을 설정하거나 해제할 수 있어요."
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/bell.svg')}
              title="알림 설정"
              hasDivider
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
            />
            <MyMenuItem
              icon={require('../../assets/icons/my/userMinus.svg')}
              title="회원탈퇴"
              tone="danger"
              hasChevron={false}
              hasDivider
            />
          </MyMenuGroup>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
