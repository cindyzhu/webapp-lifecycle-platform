import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './layout/Layout';
import Home from './router/Home';
import SubAppContainer from './router/SubAppContainer';
import { subApps } from './micro/apps';
import { registerSubApps, preloadSubApps } from './micro/loader';

export default function App() {
  useEffect(() => {
    registerSubApps(subApps);
    preloadSubApps(subApps);
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/supplier/*" element={<SubAppContainer />} />
        <Route path="/goods/*" element={<SubAppContainer />} />
      </Route>
    </Routes>
  );
}
