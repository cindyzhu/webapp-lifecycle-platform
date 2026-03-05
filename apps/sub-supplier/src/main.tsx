import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean;
    __WUJIE_MOUNT: () => void;
    __WUJIE_UNMOUNT: () => void;
    __WUJIE: { mount: () => void };
    $wujie: { shadowRoot: ShadowRoot };
  }
}

if (window.__POWERED_BY_WUJIE__) {
  let root: ReturnType<typeof ReactDOM.createRoot> | null = null;
  window.__WUJIE_MOUNT = () => {
    const container = window.$wujie.shadowRoot.querySelector('#root');
    if (!container) return;
    root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  };
  window.__WUJIE_UNMOUNT = () => {
    root?.unmount();
    root = null;
  };
  window.__WUJIE.mount();
} else {
  const container = document.getElementById('root')!;
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
