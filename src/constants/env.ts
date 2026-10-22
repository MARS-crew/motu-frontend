export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

// 개발 서버가 아니어도 테스트용 빌드(APK 등)에서 개발용 버튼을 보려면 true로 설정합니다.
export const SHOW_DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_SHOW_DEV_TOOLS === 'true';
