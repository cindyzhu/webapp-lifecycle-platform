/// <reference types="vite/client" />

declare module 'wujie-react' {
  import { ComponentType } from 'react';
  interface WujieReactProps {
    name: string;
    width?: string;
    height?: string;
    url: string;
    alive?: boolean;
    props?: Record<string, unknown>;
  }
  const WujieReact: ComponentType<WujieReactProps>;
  export default WujieReact;
}
