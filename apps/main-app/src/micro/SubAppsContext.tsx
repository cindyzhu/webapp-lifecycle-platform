import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { SubAppConfig, AppRecord, ApiResponse } from '@wlp/shared';
import { registerSubApps } from './loader';

interface SubAppsContextValue {
  subApps: SubAppConfig[];
  loading: boolean;
  getSubAppByRoute: (path: string) => SubAppConfig | undefined;
}

const SubAppsContext = createContext<SubAppsContextValue>({
  subApps: [],
  loading: true,
  getSubAppByRoute: () => undefined,
});

function pickEntry(record: AppRecord): string {
  const mode = import.meta.env.MODE; // 'development' | 'test' | 'staging' | 'production'
  switch (mode) {
    case 'test':
      return record.entry_test || record.entry_dev;
    case 'staging':
      return record.entry_staging || record.entry_dev;
    case 'production':
      return record.entry_production || record.entry_dev;
    default:
      return record.entry_dev;
  }
}

function toSubAppConfig(record: AppRecord): SubAppConfig {
  return {
    name: record.name,
    displayName: record.display_name,
    activeRule: record.active_rule,
    entry: pickEntry(record),
    props: record.props ?? {},
    deployed: {
      test: record.entry_test,
      staging: record.entry_staging,
      production: record.entry_production,
    },
  };
}

export function SubAppsProvider({ children }: { children: ReactNode }) {
  const [subApps, setSubApps] = useState<SubAppConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/apps')
      .then((r) => r.json() as Promise<ApiResponse<AppRecord[]>>)
      .then((json) => {
        if (json.data) {
          const active = json.data
            .filter((a) => a.status === 'active')
            .map(toSubAppConfig);
          setSubApps(active);
          registerSubApps(active);
        }
      })
      .catch((err) => console.error('Failed to load sub-apps:', err))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<SubAppsContextValue>(
    () => ({
      subApps,
      loading,
      getSubAppByRoute(path: string) {
        const sorted = [...subApps].sort(
          (a, b) => b.activeRule.length - a.activeRule.length,
        );
        return sorted.find((app) => path.startsWith(app.activeRule));
      },
    }),
    [subApps, loading],
  );

  return (
    <SubAppsContext.Provider value={value}>{children}</SubAppsContext.Provider>
  );
}

export function useSubApps() {
  return useContext(SubAppsContext);
}
