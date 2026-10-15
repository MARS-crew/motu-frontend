import { Pagination } from '@/components/Pagination';
import { SortDropdown } from '@/components/SortDropdown';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '금액순', value: 'amount' },
];

export default function TransactionsScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-8">
        <Text className="font-inter-bold text-xl text-motu-black">거래내역</Text>
        <SortDropdown options={SORT_OPTIONS} value={sortValue} onValueChange={setSortValue} />
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="font-inter-medium text-sm text-motu-grey">
          {SORT_OPTIONS.find((option) => option.value === sortValue)?.label}
        </Text>
      </View>
      <Pagination
        currentPage={currentPage}
        totalPages={3}
        visiblePageCount={3}
        onPageChange={setCurrentPage}
      />
    </SafeAreaView>
  );
}
