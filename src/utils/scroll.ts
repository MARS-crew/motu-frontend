import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

// 목록 끝에서 이 거리(px) 안으로 스크롤하면 다음 페이지를 불러옵니다.
const LOAD_MORE_THRESHOLD = 200;

export const isNearBottom = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) =>
  nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
  nativeEvent.contentSize.height - LOAD_MORE_THRESHOLD;
