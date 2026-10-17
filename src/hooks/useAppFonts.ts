import { useFonts } from 'expo-font';

// Pretendard는 영문·숫자가 Inter 기반이고 한글 글리프를 포함합니다.
const APP_FONTS = {
  'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
  'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
  'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
  'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
};

export function useAppFonts() {
  const [isLoaded, error] = useFonts(APP_FONTS);

  return { isLoaded, error };
}
