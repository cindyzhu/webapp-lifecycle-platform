import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReturnType<typeof ReactDOM.createRoot> | null = null;

function mount() {
  const container =
    (window as any).__WUJIE?.shadowRoot?.querySelector('#root') ??
    document.getElementById('root')!;
  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

function unmount() {
  root?.unmount();
  root = null;
}

if ((window as any).__WUJIE) {
  (window as any).__WUJIE_MOUNT__ = mount;
  (window as any).__WUJIE_UNMOUNT__ = unmount;
  mount();
} else {
  mount();
}
