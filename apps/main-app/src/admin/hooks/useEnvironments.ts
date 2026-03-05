import type { EnvironmentRecord } from '@wlp/shared';
import { useApi } from './useApi';

export function useEnvironments() {
  return useApi<EnvironmentRecord[]>('/api/environments');
}
