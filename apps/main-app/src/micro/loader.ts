import { setupApp, preloadApp } from 'wujie';
import type { SubAppConfig } from '@wlp/shared';

export function registerSubApps(apps: SubAppConfig[]) {
  apps.forEach((app) => {
    setupApp({
      name: app.name,
      url: app.entry,
      attrs: {},
      exec: true,
      alive: true,
    });
  });
}

export function preloadSubApps(apps: SubAppConfig[]) {
  apps.forEach((app) => {
    preloadApp({ name: app.name, url: app.entry });
  });
}
