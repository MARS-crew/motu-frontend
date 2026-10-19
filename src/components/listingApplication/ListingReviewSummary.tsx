import { Text, View } from 'react-native';

type ListingReviewSummaryProps = {
  steps: { title: string; isComplete: boolean }[];
};

export function ListingReviewSummary({ steps }: ListingReviewSummaryProps) {
  return (
    <View className="gap-2.5">
      {steps.map(({ title, isComplete }) => (
        <View
          key={title}
          className="h-14 flex-row items-center gap-3 rounded-xl border border-motu-border bg-white px-4"
        >
          <View
            className={`h-6 w-6 items-center justify-center rounded-full ${isComplete ? 'bg-motu-success-light' : 'bg-motu-bg-secondary'}`}
          >
            <Text
              className={`font-pretendard-medium text-xs leading-4 ${isComplete ? 'text-motu-success' : 'text-motu-text-tertiary'}`}
            >
              {isComplete ? '✓' : '−'}
            </Text>
          </View>
          <Text className="flex-1 font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
            {title}
          </Text>
          <Text
            className={`font-pretendard-medium text-xs leading-4 ${isComplete ? 'text-motu-success' : 'text-motu-text-tertiary'}`}
          >
            {isComplete ? '완료' : '미완료'}
          </Text>
        </View>
      ))}
    </View>
  );
}
