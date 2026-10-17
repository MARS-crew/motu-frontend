import { Pressable, Text, View } from 'react-native';

export type NoticeTab = 'notice' | 'faq';

const TABS: { label: string; value: NoticeTab }[] = [
  { label: '공지사항', value: 'notice' },
  { label: 'FAQ', value: 'faq' },
];

type NoticeTabsProps = {
  value: NoticeTab;
  onValueChange: (value: NoticeTab) => void;
};

export function NoticeTabs({ value, onValueChange }: NoticeTabsProps) {
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row gap-1 rounded-full bg-motu-grey-lighter/50 p-1"
    >
      {TABS.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onValueChange(tab.value)}
            className={`flex-1 items-center justify-center rounded-full px-4 py-2 ${
              isSelected ? 'bg-motu-black' : ''
            }`}
          >
            <Text
              className={`font-inter-semibold text-[13px] leading-4 ${
                isSelected ? 'text-white' : 'text-motu-grey'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
