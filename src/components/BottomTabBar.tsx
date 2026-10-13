import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

cssInterop(Image, { className: 'style' });

type TabItem = {
  activeIcon: number;
  inactiveIcon: number;
  label: string;
  routeName: string;
};

const TAB_ITEMS: TabItem[] = [
  {
    routeName: 'index',
    label: '홈',
    activeIcon: require('../../assets/icons/tabBar/homeActive.svg'),
    inactiveIcon: require('../../assets/icons/tabBar/homeInactive.svg'),
  },
  {
    routeName: 'market',
    label: '마켓',
    activeIcon: require('../../assets/icons/tabBar/marketActive.svg'),
    inactiveIcon: require('../../assets/icons/tabBar/marketInactive.svg'),
  },
  {
    routeName: 'portfolio',
    label: '포트폴리오',
    activeIcon: require('../../assets/icons/tabBar/portfolioActive.svg'),
    inactiveIcon: require('../../assets/icons/tabBar/portfolioInactive.svg'),
  },
  {
    routeName: 'transactions',
    label: '거래내역',
    activeIcon: require('../../assets/icons/tabBar/transactionsActive.svg'),
    inactiveIcon: require('../../assets/icons/tabBar/transactionsInactive.svg'),
  },
  {
    routeName: 'my',
    label: '마이',
    activeIcon: require('../../assets/icons/tabBar/myActive.svg'),
    inactiveIcon: require('../../assets/icons/tabBar/myInactive.svg'),
  },
];

export function BottomTabBar({ descriptors, navigation, state, insets }: BottomTabBarProps) {
  return (
    <View
      className="border-t border-motu-grey-lighter bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="h-[60px] flex-row">
        {TAB_ITEMS.map(({ activeIcon, inactiveIcon, label, routeName }) => {
          const routeIndex = state.routes.findIndex((route) => route.name === routeName);

          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;
          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const handleLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              testID={descriptors[route.key].options.tabBarButtonTestID}
              onLongPress={handleLongPress}
              onPress={handlePress}
              className="flex-1 items-center justify-center gap-1"
            >
              <Image
                source={isFocused ? activeIcon : inactiveIcon}
                contentFit="contain"
                className="h-[22px] w-[22px]"
              />
              <Text
                className={`font-inter-medium text-[10px] leading-[15px] ${
                  isFocused ? 'text-motu-black' : 'text-motu-grey-light'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
