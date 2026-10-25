export type LoginUser = {
  userId: number;
  loginId: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
};

export type LoginResponse = {
  accessToken: string;
  // Access 토큰 유효시간(초)입니다.
  accessTokenExpiresIn: number;
  refreshToken: string;
  user: LoginUser;
};
