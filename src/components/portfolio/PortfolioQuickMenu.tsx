import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type PortfolioQuickMenuProps = {
  onTransactionsPress: () => void;
  onAssetManagementPress: () => void;
  onAiAnalysisPress: () => void;
};

type QuickMenuButtonProps = {
  label: string;
  icon: number;
  onPress: () => void;
};

function QuickMenuButton({ label, icon, onPress }: QuickMenuButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-motu-grey-lighter bg-white active:bg-motu-grey-lighter/40"
    >
      <Image source={icon} contentFit="contain" className="h-[15px] w-[15px]" accessible={false} />
      <Text className="font-pretendard-semibold text-xs leading-[18px] text-motu-black">
        {label}
      </Text>
    </Pressable>
  );
}

export function PortfolioQuickMenu({
  onTransactionsPress,
  onAssetManagementPress,
  onAiAnalysisPress,
}: PortfolioQuickMenuProps) {
  return (
    <View>
      <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black">
        빠른 메뉴
      </Text>
      <View className="mt-2 flex-row gap-2">
        <QuickMenuButton
          label="거래 내역"
          icon={require('../../../assets/icons/portfolio/transactions.svg')}
          onPress={onTransactionsPress}
        />
        <QuickMenuButton
          label="자산 관리"
          icon={require('../../../assets/icons/portfolio/wallet.svg')}
          onPress={onAssetManagementPress}
        />
        <QuickMenuButton
          label="AI 분석"
          icon={require('../../../assets/icons/portfolio/aiAnalysis.svg')}
          onPress={onAiAnalysisPress}
        />
      </View>
    </View>
  );
}
