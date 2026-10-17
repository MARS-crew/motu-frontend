import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, TextInput, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  onSubmit: () => void;
};

export function SearchBar({ value, onChangeText, onBlur, onSubmit }: SearchBarProps) {
  return (
    <View className="h-[46px] flex-row items-center gap-2 rounded-xl border border-motu-grey-lighter bg-white px-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onSubmitEditing={onSubmit}
        placeholder="상품명/카테고리를 입력해 주세요."
        placeholderClassName="text-motu-grey-light"
        returnKeyType="search"
        autoFocus
        accessibilityLabel="검색어 입력"
        className="flex-1 px-1 font-inter-medium text-[13px] text-motu-black"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="검색"
        onPress={onSubmit}
        hitSlop={8}
        className="h-5 w-7 items-center justify-center active:opacity-60"
      >
        <Image
          source={require('../../../assets/icons/search/search.svg')}
          contentFit="contain"
          className="h-5 w-5"
        />
      </Pressable>
    </View>
  );
}
