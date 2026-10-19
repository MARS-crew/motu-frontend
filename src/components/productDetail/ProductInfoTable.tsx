import * as Linking from 'expo-linking';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { TRADE_STATUS_STYLES } from '@/constants/tradeStatus';
import type { ProductInfo, TradeStatus } from '@/types/product';

type ProductInfoTableProps = {
  info: ProductInfo;
  category: string;
  tradeStatus: TradeStatus;
};

type InfoRowProps = {
  label: string;
  isFirst?: boolean;
  isCentered?: boolean;
  children: ReactNode;
};

// 화면설계서 기준 정보가 없으면 '정보없음'으로 표시합니다.
const EMPTY_TEXT = '정보없음';

function InfoRow({ label, isFirst = false, isCentered = false, children }: InfoRowProps) {
  return (
    <View className={`flex-row ${isFirst ? '' : 'border-t border-motu-grey-lighter'}`}>
      <View className="w-[92px] bg-motu-grey-lighter/50 p-3">
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">{label}</Text>
      </View>
      <View className={`flex-1 px-3 ${isCentered ? 'justify-center py-[14px]' : 'py-3'}`}>
        {children}
      </View>
    </View>
  );
}

function InfoText({ value }: { value?: string }) {
  return (
    <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
      {value || EMPTY_TEXT}
    </Text>
  );
}

export function ProductInfoTable({ info, category, tradeStatus }: ProductInfoTableProps) {
  const status = TRADE_STATUS_STYLES[tradeStatus];
  const { officialUrl } = info;

  return (
    <View>
      <View className="overflow-hidden rounded-xl border border-motu-grey-lighter bg-white">
        <InfoRow label="상품 소개" isFirst>
          <InfoText value={info.introduction} />
        </InfoRow>
        <InfoRow label="운영사" isCentered>
          <InfoText value={info.operator} />
        </InfoRow>
        <InfoRow label="카테고리" isCentered>
          <InfoText value={category} />
        </InfoRow>
        <InfoRow label="공식 URL" isCentered>
          {officialUrl ? (
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(officialUrl)}
              className="self-start active:opacity-60"
            >
              <InfoText value={officialUrl} />
            </Pressable>
          ) : (
            <InfoText />
          )}
        </InfoRow>
        <InfoRow label="주요 서비스 지표" isCentered={info.metrics.length <= 1}>
          {info.metrics.length > 0 ? (
            <View className="gap-2">
              {info.metrics.map((metric) => (
                <InfoText key={metric} value={metric} />
              ))}
            </View>
          ) : (
            <InfoText />
          )}
        </InfoRow>
        <InfoRow label="상장일" isCentered>
          <InfoText value={info.listedAt} />
        </InfoRow>
        <InfoRow label="거래 상태">
          <View
            className={`flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1.5 ${status.badgeClassName}`}
          >
            <View className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`} />
            <Text
              className={`font-pretendard-semibold text-[11px] leading-[14px] ${status.textClassName}`}
            >
              {status.label}
            </Text>
          </View>
        </InfoRow>
      </View>
      <Text className="pt-4 font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
        * 본 서비스는 모의투자를 위한 상품이며, 실제 금융 상품이 아닙니다.
      </Text>
    </View>
  );
}
