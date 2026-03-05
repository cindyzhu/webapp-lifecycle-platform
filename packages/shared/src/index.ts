export interface SubAppConfig {
  name: string;
  displayName: string;
  activeRule: string;
  entry: string;
  props: Record<string, unknown>;
  deployed: {
    test: string;
    staging: string;
    production: string;
  };
}

export interface AppsManifest {
  apps: SubAppConfig[];
}

export interface RouteConfig {
  path: string;
  app: string;
  description: string;
}

export interface RoutesManifest {
  routes: RouteConfig[];
  matchStrategy: string;
}

export interface EnvironmentConfig {
  name: string;
  displayName: string;
  domain: string;
  cluster: string;
}

export const APP_EVENTS = {
  GLOBAL_STATE_CHANGE: 'global:state-change',
  SUB_APP_MOUNTED: 'sub-app:mounted',
  SUB_APP_UNMOUNTED: 'sub-app:unmounted',
} as const;

// ── Database record types (match Supabase table columns) ──

export interface AppRecord {
  id: string;
  name: string;
  display_name: string;
  active_rule: string;
  entry_dev: string;
  entry_test: string;
  entry_staging: string;
  entry_production: string;
  props: Record<string, unknown>;
  status: 'active' | 'inactive' | 'deprecated';
  git_repo: string;
  vercel_project_id: string;
  created_at: string;
  updated_at: string;
}

export interface EnvironmentRecord {
  id: string;
  name: string;
  display_name: string;
  domain: string;
  cluster: 'shared' | 'dedicated';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DeploymentRecord {
  id: string;
  app_id: string;
  environment: string;
  version: string;
  url: string;
  status: 'success' | 'failed' | 'rollback' | 'in_progress';
  deployed_by: string;
  notes: string;
  deployed_at: string;
  app?: Pick<AppRecord, 'name' | 'display_name'>;
}

// ── API request body types ──

export type CreateAppBody = Omit<AppRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAppBody = Partial<CreateAppBody>;

export type CreateEnvironmentBody = Omit<EnvironmentRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEnvironmentBody = Partial<CreateEnvironmentBody>;

export type CreateDeploymentBody = Omit<DeploymentRecord, 'id' | 'deployed_at' | 'app'>;

// ── API response envelope ──

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
