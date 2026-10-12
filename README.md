# motu-frontend
2026 마스외전 하반기 프로젝트 모투

<br>

## Tech Stack

| 구분 | 사용 기술 |
|------|-----------|
| 프레임워크 | React Native (Expo SDK 57) |
| 언어 | TypeScript |
| 화면 이동 | Expo Router |
| 스타일링 | Tailwind (NativeWind) |
| 클라이언트 상태 관리 | Zustand |
| 서버 상태 관리 | TanStack Query |
| HTTP 요청 | Axios |
| 폼 관리 | React Hook Form |
| 유효성 검증 | Zod |
| 토큰 저장 | expo-secure-store |
| 린트 / 포맷 | ESLint + Prettier |

<br>

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (.env 는 커밋하지 않습니다)
cp .env.example .env

# 3. 개발 서버 실행
npx expo start
```

- 패키지를 추가할 때는 SDK와 호환되는 버전으로 설치되도록 `npm install` 대신 `npx expo install <package>`를 사용합니다.
- 환경 변수는 `EXPO_PUBLIC_` 접두사로 작성합니다. 이 값은 앱 번들에 포함되므로 비밀키를 넣지 않습니다.

<br>

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm start` | 개발 서버 실행 |
| `npm run android` / `ios` / `web` | 플랫폼별 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | 타입 검사 |
| `npm run format` | Prettier 포맷 적용 |
| `npm run format:check` | Prettier 포맷 검사 |

<br>

## 폴더 구조

```
app/                    # Expo Router 라우트 (화면)
  (auth)/               #   로그인/회원가입 그룹
  (tabs)/               #   하단 탭 그룹
  _layout.tsx
src/
  apis/                 # axios 인스턴스, API 요청 함수
  queries/              # TanStack Query 훅 (useXxxQuery, useXxxMutation)
  stores/               # Zustand 스토어
  schemas/              # Zod 스키마
  components/           # 공용 컴포넌트
  hooks/                # 공용 커스텀 훅
  constants/            # 상수
  types/                # 공용 타입
  utils/                # 유틸 함수
assets/                 # 이미지, 폰트
```

- import는 절대경로 `@/`를 사용합니다. → `import { api } from '@/apis/instance';`

<br>

## 컨벤션

Git 컨벤션과 코드 컨벤션은 Notion에서 관리합니다.

- [motu 컨벤션 (Notion)](https://app.notion.com/p/motu_convention-94dd69e1aaa683b29e4d81416531c97d)
