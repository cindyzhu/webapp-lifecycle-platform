import type { AppRecord } from '@wlp/shared';
import { useApi } from './useApi';

export function useApps() {
  return useApi<AppRecord[]>('/api/apps');
}
