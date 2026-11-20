import { SessionChangedError } from '@/apis/instance';
import type { LoginResponse } from '@/types/auth';
import { tokenStorage } from '@/utils/tokenStorage';

export async function saveLoginSession(result: LoginResponse, expectedSessionId: number) {
  if (expectedSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
  const persistence = tokenStorage.setTokens(result.accessToken, result.refreshToken);
  const revision = tokenStorage.getRevision();
  await persistence;
  if (revision !== tokenStorage.getRevision()) throw new SessionChangedError();
  return revision;
}
