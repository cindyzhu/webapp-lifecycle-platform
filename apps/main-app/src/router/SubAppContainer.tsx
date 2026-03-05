import { useRef, useEffect } from 'react';
import { startApp, destroyApp } from 'wujie';
import { useLocation } from 'react-router-dom';
import { useSubApps } from '../micro/SubAppsContext';

export default function SubAppContainer() {
  const location = useLocation();
  const { loading, getSubAppByRoute } = useSubApps();
  const topSegment = '/' + location.pathname.split('/').filter(Boolean)[0];
  const app = getSubAppByRoute(topSegment);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!app || !elRef.current) return;
    startApp({
      name: app.name,
      url: app.entry,
      el: elRef.current,
      alive: true,
      props: { route: location.pathname },
    }).catch((err) => {
      console.error(`[wujie] startApp error for ${app.name}:`, err);
    });
    return () => {
      destroyApp(app.name);
    };
  }, [app?.name, app?.entry]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
        Loading...
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
        <h2>404</h2>
        <p>Sub-application not found for route: {topSegment}</p>
      </div>
    );
  }

  return <div ref={elRef} style={{ width: '100%', height: '100%' }} />;
}
