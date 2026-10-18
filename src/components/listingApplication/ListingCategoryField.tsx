import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LISTING_CATEGORIES } from '@/schemas/listingBasicInfoSchema';

cssInterop(Image, { className: 'style' });

type ListingCategoryFieldProps = {
  value: string;
  errorMessage?: string;
  onChange: (value: string) => void;
};

export function ListingCategoryField({ value, errorMessage, onChange }: ListingCategoryFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View className="gap-2">
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        카테고리 <Text className="text-motu-btn-red">*</Text>
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="카테고리 선택"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        className={`h-[50px] flex-row items-center rounded-xl border bg-white px-4 ${errorMessage ? 'border-motu-btn-red' : isOpen ? 'border-motu-black' : 'border-motu-border'}`}
      >
        <Text
          className={`flex-1 font-pretendard-medium text-sm leading-5 ${value ? 'text-motu-text-primary' : 'text-motu-text-tertiary'}`}
        >
          {value || '선택해 주세요.'}
        </Text>
        <Image
          source={
            isOpen
              ? require('../../../assets/icons/listingApplication/form/chevronDown.svg')
              : require('../../../assets/icons/listingApplication/form/chevronRight.svg')
          }
          contentFit="contain"
          className="h-[18px] w-[18px]"
        />
      </Pressable>
      {isOpen && (
        <View className="rounded-xl border border-motu-border bg-white p-1.5">
          {LISTING_CATEGORIES.map((category) => (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityState={{ selected: value === category }}
              onPress={() => {
                onChange(category);
                setIsOpen(false);
              }}
              className={`h-11 flex-row items-center gap-2 rounded-lg px-3 ${value === category ? 'bg-motu-bg-secondary' : ''}`}
            >
              <Text className="flex-1 font-pretendard-medium text-sm leading-5 text-motu-text-primary">
                {category}
              </Text>
              {value === category && (
                <Image
                  source={require('../../../assets/icons/listingApplication/form/selectedCheck.svg')}
                  className="h-[18px] w-[18px]"
                  contentFit="contain"
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
      {errorMessage && (
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-btn-red"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
