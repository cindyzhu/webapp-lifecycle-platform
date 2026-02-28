import { NavLink } from 'react-router-dom';
import { subApps } from '../micro/apps';
import styles from './Sidebar.module.css';

export default function Sidebar() {
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
      </nav>
    </aside>
  );
}
