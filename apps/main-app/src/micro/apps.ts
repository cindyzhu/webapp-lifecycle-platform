import type { SubAppConfig } from '@wlp/shared';

// In production, Vite replaces these with Vercel env vars at build time.
// In local dev, falls back to localhost.
const SUPPLIER_URL = import.meta.env.VITE_SUPPLIER_URL || 'http://localhost:5174';
const GOODS_URL = import.meta.env.VITE_GOODS_URL || 'http://localhost:5175';

export const subApps: SubAppConfig[] = [
  {
    name: 'sub-supplier',
    displayName: 'Supplier',
    activeRule: '/supplier',
    entry: SUPPLIER_URL,
    props: {},
    deployed: { test: '', staging: '', production: '' },
  },
  {
    name: 'sub-goods',
    displayName: 'Goods',
    activeRule: '/goods',
    entry: GOODS_URL,
    props: {},
    deployed: { test: '', staging: '', production: '' },
  },
];

export function getSubAppByRoute(path: string): SubAppConfig | undefined {
  // Longest prefix match
  const sorted = [...subApps].sort(
    (a, b) => b.activeRule.length - a.activeRule.length,
  );
  return sorted.find((app) => path.startsWith(app.activeRule));
}
