import { NavLink } from 'react-router-dom';
import { useSubApps } from '../micro/SubAppsContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { subApps } = useSubApps();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>WLP</div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Home
        </NavLink>

        <div className={styles.sectionLabel}>Apps</div>
        {subApps.map((app) => (
          <NavLink
            key={app.name}
            to={app.activeRule}
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            {app.displayName}
          </NavLink>
        ))}

        <div className={styles.sectionLabel}>Admin</div>
        <NavLink
          to="/admin/apps"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Registered Apps
        </NavLink>
        <NavLink
          to="/admin/environments"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Environments
        </NavLink>
        <NavLink
          to="/admin/deployments"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Deployments
        </NavLink>
      </nav>
    </aside>
  );
}
