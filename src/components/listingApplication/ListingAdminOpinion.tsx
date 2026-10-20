import { Text, View } from 'react-native';

type ListingAdminOpinionProps = { opinion: string };

export function ListingAdminOpinion({ opinion }: ListingAdminOpinionProps) {
  return (
    <View className="gap-2 rounded-[14px] bg-motu-red-light p-4">
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-btn-red">
        관리자 의견
      </Text>
      <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-primary">
        {opinion}
      </Text>
    </View>
  );
}
