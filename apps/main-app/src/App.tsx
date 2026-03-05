import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './router/Home';
import SubAppContainer from './router/SubAppContainer';
import AdminApps from './admin/pages/AdminApps';
import AdminAppDetail from './admin/pages/AdminAppDetail';
import AdminEnvironments from './admin/pages/AdminEnvironments';
import AdminDeployments from './admin/pages/AdminDeployments';
import { SubAppsProvider } from './micro/SubAppsContext';

export default function App() {
  return (
    <SubAppsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin/apps" element={<AdminApps />} />
          <Route path="/admin/apps/:id" element={<AdminAppDetail />} />
          <Route path="/admin/environments" element={<AdminEnvironments />} />
          <Route path="/admin/deployments" element={<AdminDeployments />} />
          <Route path="/:appName/*" element={<SubAppContainer />} />
        </Route>
      </Routes>
    </SubAppsProvider>
  );
}
