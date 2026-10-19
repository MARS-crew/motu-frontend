import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import type { AssetCompositionItem } from '@/types/portfolio';

type AssetCompositionCardProps = {
  items: AssetCompositionItem[];
  valuation: number;
};

const CHART_SIZE = 160;
const RING_WIDTH = 28;
const RADIUS = (CHART_SIZE - RING_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// 조각 사이를 흰 선처럼 띄우는 간격입니다.
const SEGMENT_GAP = 2;

const chunkPairs = <T,>(items: T[]) =>
  Array.from({ length: Math.ceil(items.length / 2) }, (_, index) =>
    items.slice(index * 2, index * 2 + 2),
  );

export function AssetCompositionCard({ items, valuation }: AssetCompositionCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const getRatio = (value: number) => (total > 0 ? value / total : 0);

  // 피그마처럼 12시 방향에서 시계 반대 방향으로 그리고, 예수금 조각이 12시에서 끝나도록 마지막에 둡니다.
  const chartItems = [...items.slice(1), items[0]];
  let offset = 0;
  const segments = chartItems.map((item) => {
    const length = getRatio(item.value) * CIRCUMFERENCE;
    const segment = { ...item, length, offset };
    offset += length;
    return segment;
  });

  return (
    <View className="rounded-xl border border-motu-grey-lighter bg-white p-[17px]">
      <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black">
        자산 구성
      </Text>

      <View className="mt-2 h-[172px] items-center justify-center">
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G transform={`translate(${CHART_SIZE / 2} ${CHART_SIZE / 2}) rotate(-90) scale(1 -1)`}>
            {segments.map((segment) =>
              segment.length > SEGMENT_GAP ? (
                <Circle
                  key={segment.label}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={RING_WIDTH}
                  strokeDasharray={`${segment.length - SEGMENT_GAP} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-segment.offset}
                />
              ) : null,
            )}
          </G>
        </Svg>
        <View className="absolute items-center">
          <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey">
            평가금액
          </Text>
          <Text className="mt-0.5 font-pretendard-bold text-[15px] leading-[22.5px] tracking-[-0.3px] text-motu-black">
            {`${valuation.toLocaleString('ko-KR')} P`}
          </Text>
        </View>
      </View>

      <View className="mt-3 gap-2">
        {chunkPairs(items).map((pair) => (
          <View key={pair[0].label} className="flex-row gap-4">
            {pair.map((item) => (
              <View key={item.label} className="flex-1 flex-row items-center gap-2">
                {/* 항목별 색상은 데이터 순서로 정해져 style로 지정합니다. */}
                <View
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text
                  numberOfLines={1}
                  className="flex-1 font-pretendard text-[11px] leading-[16.5px] text-motu-grey"
                >
                  {item.label}
                </Text>
                <Text className="font-pretendard-semibold text-[11px] leading-[16.5px] text-motu-black">
                  {`${Math.round(getRatio(item.value) * 100)}%`}
                </Text>
              </View>
            ))}
            {pair.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </View>
    </View>
  );
}
