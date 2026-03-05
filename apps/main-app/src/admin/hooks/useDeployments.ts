import type { DeploymentRecord } from '@wlp/shared';
import { useApi } from './useApi';

export function useDeployments(appId?: string) {
  const url = appId ? `/api/deployments?app_id=${appId}` : '/api/deployments';
  return useApi<DeploymentRecord[]>(url);
}
