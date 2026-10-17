import { Pressable, Text, View } from 'react-native';

type ProductDetailTabsProps<T extends string> = {
  tabs: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
};

export function ProductDetailTabs<T extends string>({
  tabs,
  value,
  onValueChange,
}: ProductDetailTabsProps<T>) {
  return (
    <View accessibilityRole="tablist" className="flex-row border-b border-motu-grey-lighter px-6">
      {tabs.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onValueChange(tab.value)}
            className="flex-1 items-center pb-2.5 pt-1"
          >
            <Text
              className={`text-[13px] leading-[18px] ${
                isSelected
                  ? 'font-pretendard-bold text-motu-black'
                  : 'font-pretendard-medium text-motu-grey'
              }`}
            >
              {tab.label}
            </Text>
            {isSelected && (
              <View className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-motu-black" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
