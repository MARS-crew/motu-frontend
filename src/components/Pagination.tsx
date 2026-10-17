import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  visiblePageCount: number;
  onPageChange: (page: number) => void;
};

cssInterop(Image, { className: 'style' });

const getPageNumbers = (currentPage: number, totalPages: number, visiblePageCount: number) => {
  const pageButtonCount = Math.max(1, Math.floor(visiblePageCount));
  const startPage = Math.min(
    Math.max(1, currentPage - Math.floor(pageButtonCount / 2)),
    Math.max(1, totalPages - pageButtonCount + 1),
  );
  const pageCount = Math.min(pageButtonCount, totalPages);

  return Array.from({ length: pageCount }, (_, index) => startPage + index);
};

export function Pagination({
  currentPage,
  totalPages,
  visiblePageCount,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  const selectedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageNumbers = getPageNumbers(selectedPage, totalPages, visiblePageCount);
  const isPreviousDisabled = selectedPage === 1;
  const isNextDisabled = selectedPage === totalPages;

  return (
    <View className="flex-row items-center justify-center gap-2 p-6">
      <Pressable
        accessibilityLabel="이전 페이지"
        accessibilityRole="button"
        accessibilityState={{ disabled: isPreviousDisabled }}
        disabled={isPreviousDisabled}
        onPress={() => onPageChange(selectedPage - 1)}
        className="h-7 w-7 items-center justify-center rounded-full"
      >
        <Image
          source={
            isPreviousDisabled
              ? require('../../assets/icons/pagination/chevronLeft.svg')
              : require('../../assets/icons/pagination/chevronRight.svg')
          }
          contentFit="contain"
          className={`h-[17px] w-[17px] ${isPreviousDisabled ? '' : 'rotate-180'}`}
        />
      </Pressable>

      {pageNumbers.map((page) => {
        const isSelected = page === selectedPage;

        return (
          <Pressable
            key={page}
            accessibilityLabel={`${page}페이지`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onPageChange(page)}
            className={`h-7 w-7 items-center justify-center rounded-lg ${
              isSelected ? 'bg-motu-black' : ''
            }`}
          >
            <Text
              className={`font-pretendard-medium text-xs leading-4 ${
                isSelected ? 'text-white' : 'text-motu-grey'
              }`}
            >
              {page}
            </Text>
          </Pressable>
        );
      })}

      <Pressable
        accessibilityLabel="다음 페이지"
        accessibilityRole="button"
        accessibilityState={{ disabled: isNextDisabled }}
        disabled={isNextDisabled}
        onPress={() => onPageChange(selectedPage + 1)}
        className="h-7 w-7 items-center justify-center rounded-full"
      >
        <Image
          source={
            isNextDisabled
              ? require('../../assets/icons/pagination/chevronLeft.svg')
              : require('../../assets/icons/pagination/chevronRight.svg')
          }
          contentFit="contain"
          className={`h-[17px] w-[17px] ${isNextDisabled ? 'rotate-180' : ''}`}
        />
      </Pressable>
    </View>
  );
}
