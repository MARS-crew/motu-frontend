import { Pagination } from '@/components/Pagination';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">거래내역</Text>
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
