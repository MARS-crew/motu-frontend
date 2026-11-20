import { randomUUID } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'motu.deviceId';
let pendingDeviceId: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  pendingDeviceId ??= (async () => {
    if (Platform.OS === 'web') {
      const existing = localStorage.getItem(DEVICE_ID_KEY);
      if (existing) return existing;
      const id = randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, id);
      return id;
    }
    const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = randomUUID();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    return id;
  })().catch((error: unknown) => {
    pendingDeviceId = null;
    throw error;
  });
  return pendingDeviceId;
}
