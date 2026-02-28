import { subApps } from '../micro/apps';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Web App Lifecycle Platform</h1>
      <p className={styles.subtitle}>
        Micro-frontend management platform — select a sub-application from the
        sidebar to get started.
      </p>
      <div className={styles.cards}>
        {subApps.map((app) => (
          <div key={app.name} className={styles.card}>
            <h3>{app.displayName}</h3>
            <p className={styles.rule}>{app.activeRule}</p>
            <span className={styles.status}>
              {app.entry.includes('localhost') ? 'Local Dev' : 'Deployed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
