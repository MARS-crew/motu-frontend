이 프로젝트는 Expo / React Native 모바일 앱입니다. 모바일 우선 패턴, 성능, 크로스 플랫폼 호환성을 우선으로 고려합니다.

## Expo는 계속 바뀝니다 — 학습 데이터를 믿지 마세요

Expo는 SDK 버전마다 호환되지 않는 변경(breaking change)이 있습니다. 기억하고 있는 API가 이름이 바뀌었거나, 옮겨졌거나, 삭제되었을 수 있습니다. Expo, EAS, React Native API를 사용하는 코드를 작성하기 전에 다음을 확인합니다.

1. `package.json`에서 `expo` 패키지의 메이저 버전을 확인합니다.
2. 해당 버전의 문서를 확인합니다: `https://docs.expo.dev/versions/v<메이저버전>.0.0/`
3. 그 외 내용은 https://docs.expo.dev/llms.txt 를 확인합니다. 전체 Expo 문서 목록과 LLM이 자주 틀리는 내용에 대한 정정이 담겨 있습니다. 필요한 페이지 링크를 따라가서 확인하고, 기억에 의존해 답하지 않습니다.

## 명령어

```bash
npx expo install <package>  # 패키지 설치 시 항상 사용 (npm install 대신) — SDK와 호환되는 버전으로 설치
npx expo start              # 개발 서버 실행
npm run lint                # 린트
npm run typecheck           # 타입 체크
npm run format              # Prettier 포맷
npx expo-doctor             # 의존성 및 설정 문제 진단
npx expo install --fix      # 호환되지 않는 패키지 버전 수정
```

작업을 완료하기 전에 반드시 린트와 타입 체크를 통과시킵니다.

## 화면 이동 & 라우팅

- 모든 화면 이동은 **Expo Router**를 사용합니다. 라우트는 `app/`에 둡니다. 이 폴더의 모든 파일은 화면이고, `_layout.tsx`는 네비게이터를 정의합니다. 라우트가 아닌 코드(컴포넌트, 훅, 유틸 등)는 `src/`에 둡니다.
- `Link`, `router`, `useLocalSearchParams`는 `expo-router`에서 import 합니다.
- 문서: https://docs.expo.dev/router/introduction.md

## EAS 빌드

EAS로 클라우드에서 앱을 빌드·서명·제출(`eas build`, `eas submit`)하고, OTA 업데이트(`eas update`)를 배포합니다. 로컬에 Xcode나 Android Studio가 없어도 됩니다. EAS CLI는 `npx eas-cli@latest <command>`로 실행하고, 문서 예시의 `eas` 명령도 이렇게 바꿔서 사용합니다.
문서: https://docs.expo.dev/eas/index.md

## 규칙

- `ios/`, `android/` 폴더는 자동 생성됩니다(Continuous Native Generation). 직접 만들거나 수정하지 말고, 네이티브 설정은 `app.json`과 config plugin으로 합니다.
- Expo Go에는 기본 내장된 네이티브 모듈만 들어 있습니다. 네이티브 코드가 있는 라이브러리를 추가하면 개발 빌드가 필요합니다: 로컬에서는 `npx expo run:ios|android`, 클라우드에서는 `eas build --profile development`.
- 서드파티 라이브러리보다 Expo 권장 모듈을 우선 사용합니다. 문서: https://docs.expo.dev/versions/latest/index.md
- 코드·Git 컨벤션은 Notion에서 관리합니다(링크는 `README.md`의 컨벤션 섹션 참고).

## 코드 컨벤션 요약

전체 내용은 Notion의 Code Convention 문서를 따릅니다. 코드를 작성할 때는 최소한 아래 규칙을 지킵니다.

**구조**

- `app/`에는 화면(라우트) 파일만 둡니다. 화면 전용 컴포넌트가 많아지면 `src/components/<화면명>/`으로 옮깁니다.
- import는 절대경로 `@/`를 사용합니다. → `import { api } from '@/apis/instance';`

**네이밍**

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 / 컴포넌트 | PascalCase | `CoinCard.tsx` |
| 라우트 파일 (`app/`) | kebab-case | `coin-detail.tsx`, `[id].tsx` |
| 그 외 파일 (훅, 유틸, api 등) | camelCase | `formatPrice.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 타입 | PascalCase, `I` 접두사 X | `CoinCardProps` |
| Zustand 스토어 / Query 훅 | `use<Name>Store` / `use<Name>Query`, `use<Name>Mutation` | `useAuthStore`, `useCoinListQuery` |
| Zod 스키마 | `<name>Schema` | `loginSchema` |
| 이벤트 핸들러 | 내부 `handle~`, props `on~` | `handlePress`, `onPress` |
| boolean | `is` / `has` / `can` 접두사 | `isLoading` |

**컴포넌트 · TypeScript**

- 함수형 컴포넌트만 사용합니다. 화면(`app/`)은 `export default`, 그 외는 named export를 사용합니다.
- Props 타입은 `<컴포넌트명>Props`로 컴포넌트 위에 선언합니다.
- `any` 대신 `unknown`을 쓰고 좁혀서 사용합니다. 객체 타입은 `type`을 기본으로 씁니다.
- 폼/요청 데이터 타입은 Zod 스키마에서 추론합니다. → `z.infer<typeof loginSchema>`

**스타일링**

- `className`(NativeWind)으로 스타일링합니다. `StyleSheet`·인라인 `style`은 애니메이션 등 동적인 값에만 씁니다.
- 공통 색상·폰트는 `tailwind.config.js` theme에 등록해서 사용합니다. 임의값(`bg-[#123456]`)은 피합니다.

**상태 · API · 폼**

- 서버 데이터는 TanStack Query, 여러 화면이 공유하는 클라이언트 상태는 Zustand, 폼 입력값은 React Hook Form, 컴포넌트 내부 상태는 `useState`로 관리합니다.
- 서버 데이터를 Zustand에 복사해서 저장하지 않습니다.
- axios 인스턴스는 `src/apis/instance.ts` 하나만 씁니다. 흐름은 `apis/`(요청 함수) → `queries/`(Query 훅) → 컴포넌트이고, 컴포넌트에서 axios를 직접 호출하지 않습니다.
- 폼은 React Hook Form + `zodResolver`로 작성합니다. 스키마는 `src/schemas/`에 두고 에러 메시지는 한글로 씁니다.

**보안**

- 토큰은 expo-secure-store에만 저장합니다. AsyncStorage나 Zustand persist에 저장하지 않습니다.
- `EXPO_PUBLIC_` 환경 변수는 앱 번들에 포함되므로 비밀키를 넣지 않습니다.

**포맷**

- 포맷은 Prettier 결과를 그대로 따릅니다(Tailwind 클래스 순서는 `prettier-plugin-tailwindcss`가 정렬).
