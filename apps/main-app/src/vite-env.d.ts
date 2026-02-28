/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPPLIER_URL: string;
  readonly VITE_GOODS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'wujie-react' {
  import { ComponentType } from 'react';
  interface WujieReactProps {
    name: string;
    width?: string;
    height?: string;
    url: string;
    props?: Record<string, unknown>;
  }
  const WujieReact: ComponentType<WujieReactProps>;
  export default WujieReact;
}
