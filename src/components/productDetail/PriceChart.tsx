import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { CandlestickChart, type CandlestickChartCandleProps } from 'react-native-wagmi-charts';

import type { ChartPeriod, ProductCandle } from '@/types/product';

// svg 색상 속성은 className을 쓸 수 없어 tailwind.config.js의 토큰 값을 그대로 씁니다.
const RISE_COLOR = '#F04452';
const FALL_COLOR = '#2175F3';
const GRID_COLOR = '#F0F0F1';

const CANDLE_HEIGHT = 210;
const VOLUME_HEIGHT = 46;
const VOLUME_BAR_MAX_HEIGHT = 42;
const Y_AXIS_WIDTH = 58;
const Y_LABEL_HEIGHT = 14;
const PRICE_LABEL_HEIGHT = 18;
const X_LABEL_WIDTH = 40;
const X_LABEL_INTERVAL = 7;

type PriceChartProps = {
  candles: ProductCandle[];
  currentPrice: number;
  period: ChartPeriod;
};

// 가격 범위를 4칸 정도로 나누는 1·2·5 단위 눈금 간격을 구합니다.
const getTickStep = (range: number) => {
  const rawStep = range / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
};

const getPriceAxis = (candles: ProductCandle[]) => {
  const min = Math.min(...candles.map((candle) => candle.low));
  const max = Math.max(...candles.map((candle) => candle.high));
  const step = getTickStep(Math.max(max - min, 1));
  const firstTick = Math.floor(min / step) * step;
  const lastTick = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let tick = firstTick; tick <= lastTick; tick += step) ticks.push(tick);

  // 맨 위 눈금 글자가 잘리지 않도록 위쪽에 여백을 둡니다.
  return { domain: [firstTick, lastTick + step * 0.2] as [number, number], ticks };
};

const formatTimeLabel = (timestamp: number, period: ChartPeriod) => {
  const date = new Date(timestamp);
  switch (period) {
    case 'minute':
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    case 'hour':
      return `${date.getHours()}시`;
    case 'week':
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case 'month':
      return `${date.getMonth() + 1}월`;
    default:
      return `${date.getDate()}일`;
  }
};

type CandleRenderers = Required<Pick<CandlestickChartCandleProps, 'renderRect' | 'renderLine'>>;

// 라이브러리 기본 렌더러는 useAnimations 등 svg에 없는 속성까지 넘겨 웹에서 경고가 나서, 필요한 속성만 넘깁니다.
const renderCandleBody: CandleRenderers['renderRect'] = ({ x, y, width, height, fill }) => (
  <Rect x={x} y={y} width={width} height={height} fill={fill} />
);

const renderCandleWick: CandleRenderers['renderLine'] = ({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth,
}) => <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} />;

export function PriceChart({ candles, currentPrice, period }: PriceChartProps) {
  const [width, setWidth] = useState(0);
  const chartWidth = Math.max(width - Y_AXIS_WIDTH, 0);
  const step = candles.length > 0 ? chartWidth / candles.length : 0;
  const barMargin = step * 0.2;

  const { domain, ticks } = useMemo(() => getPriceAxis(candles), [candles]);
  const maxVolume = Math.max(...candles.map((candle) => candle.volume), 1);

  const getY = (value: number) => ((domain[1] - value) / (domain[1] - domain[0])) * CANDLE_HEIGHT;
  const currentPriceY = getY(currentPrice);
  // 현재가 표시와 겹치는 눈금 글자는 숨깁니다.
  const visibleTicks = ticks.filter(
    (tick) => Math.abs(getY(tick) - currentPriceY) >= (Y_LABEL_HEIGHT + PRICE_LABEL_HEIGHT) / 2,
  );

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <View className="flex-row" style={{ height: CANDLE_HEIGHT }}>
        <View style={{ width: chartWidth }}>
          {chartWidth > 0 && (
            <>
              {/* Svg는 네이티브에서 className을 받지 못해 겹치기 위치를 감싼 View에 지정합니다. */}
              <View className="absolute left-0 top-0">
                <Svg width={chartWidth} height={CANDLE_HEIGHT}>
                  {ticks.map((tick) => (
                    <Line
                      key={tick}
                      x1={0}
                      x2={chartWidth}
                      y1={getY(tick)}
                      y2={getY(tick)}
                      stroke={GRID_COLOR}
                      strokeWidth={1}
                    />
                  ))}
                  <Line
                    x1={0}
                    x2={chartWidth}
                    y1={currentPriceY}
                    y2={currentPriceY}
                    stroke={RISE_COLOR}
                    strokeOpacity={0.45}
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                </Svg>
              </View>
              <CandlestickChart.Provider data={candles} valueRangeY={domain}>
                <CandlestickChart width={chartWidth} height={CANDLE_HEIGHT}>
                  <CandlestickChart.Candles
                    positiveColor={RISE_COLOR}
                    negativeColor={FALL_COLOR}
                    margin={barMargin}
                    useAnimations={false}
                    renderRect={renderCandleBody}
                    renderLine={renderCandleWick}
                  />
                </CandlestickChart>
              </CandlestickChart.Provider>
            </>
          )}
        </View>

        {/* 눈금·현재가 위치는 계산값이라 style로 지정합니다. */}
        <View className="flex-1">
          {visibleTicks.map((tick) => (
            <Text
              key={tick}
              className="absolute right-0 font-pretendard-medium text-[11px] leading-[14px] text-motu-grey"
              style={{ top: getY(tick) - Y_LABEL_HEIGHT / 2 }}
            >
              {tick.toLocaleString('ko-KR')}
            </Text>
          ))}
          <View
            className="absolute right-0 h-[18px] justify-center rounded bg-motu-red px-1.5"
            style={{ top: currentPriceY - PRICE_LABEL_HEIGHT / 2 }}
          >
            <Text className="font-pretendard-semibold text-[11px] leading-[14px] text-white">
              {currentPrice.toLocaleString('ko-KR')}
            </Text>
          </View>
        </View>
      </View>

      {chartWidth > 0 && (
        <>
          <Svg width={chartWidth} height={VOLUME_HEIGHT}>
            {candles.map((candle, index) => {
              const barHeight = (candle.volume / maxVolume) * VOLUME_BAR_MAX_HEIGHT;

              return (
                <Rect
                  key={candle.timestamp}
                  x={index * step + barMargin}
                  y={VOLUME_HEIGHT - barHeight}
                  width={Math.max(step - barMargin * 2, 1)}
                  height={barHeight}
                  fill={candle.close > candle.open ? RISE_COLOR : FALL_COLOR}
                  fillOpacity={0.65}
                />
              );
            })}
          </Svg>
          <View className="h-[18px]" style={{ width: chartWidth }}>
            {candles.map((candle, index) =>
              index % X_LABEL_INTERVAL === 0 ? (
                <Text
                  key={candle.timestamp}
                  className="absolute bottom-0 text-center font-pretendard text-[10px] leading-[13px] text-motu-grey"
                  style={{
                    left: index * step + step / 2 - X_LABEL_WIDTH / 2,
                    width: X_LABEL_WIDTH,
                  }}
                >
                  {formatTimeLabel(candle.timestamp, period)}
                </Text>
              ) : null,
            )}
          </View>
        </>
      )}
    </View>
  );
}
