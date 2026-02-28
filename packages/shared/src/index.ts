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
