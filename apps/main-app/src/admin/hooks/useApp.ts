import type { AppRecord } from '@wlp/shared';
import { useApi } from './useApi';

export function useApp(id: string) {
  return useApi<AppRecord>(`/api/apps/${id}`);
}
