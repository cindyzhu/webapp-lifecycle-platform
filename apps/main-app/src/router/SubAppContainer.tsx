import WujieReact from 'wujie-react';
import { useLocation } from 'react-router-dom';
import { getSubAppByRoute } from '../micro/apps';

export default function SubAppContainer() {
  const location = useLocation();
  const topSegment = '/' + location.pathname.split('/').filter(Boolean)[0];
  const app = getSubAppByRoute(topSegment);

  if (!app) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
        <h2>404</h2>
        <p>Sub-application not found for route: {topSegment}</p>
      </div>
    );
  }

  return (
    <WujieReact
      name={app.name}
      width="100%"
      height="100%"
      url={app.entry}
      props={{ route: location.pathname }}
    />
  );
}
