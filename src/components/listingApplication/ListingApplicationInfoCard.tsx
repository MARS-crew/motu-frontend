import { Text, View } from 'react-native';

type ListingApplicationInfoCardProps = {
  rows: { label: string; value: string }[];
};

export function ListingApplicationInfoCard({ rows }: ListingApplicationInfoCardProps) {
  return (
    <View className="gap-3 rounded-[14px] border border-motu-border bg-white px-[15px] py-[15px]">
      {rows.map(({ label, value }) => (
        <View key={label} className="flex-row items-center gap-2">
          <Text className="shrink-0 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary">
            {label}
          </Text>
          <Text
            numberOfLines={2}
            className="flex-1 text-right font-pretendard-bold text-[15px] leading-5 text-motu-text-primary"
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}
