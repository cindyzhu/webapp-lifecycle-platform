import type { SubAppConfig } from '@wlp/shared';

export function registerSubApps(_apps: SubAppConfig[]) {
  // No-op: WujieReact's startApp handles the full lifecycle
  // (create sandbox, fetch HTML, inject into shadow DOM, execute JS).
  // Calling setupApp or preloadApp here creates a sandbox too early,
  // before a DOM container exists, causing mount failures.
}
