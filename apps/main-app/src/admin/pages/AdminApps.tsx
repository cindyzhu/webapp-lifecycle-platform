import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApps } from '../hooks/useApps';
import { apiMutate } from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import styles from './AdminApps.module.css';

export default function AdminApps() {
  const { data: apps, loading, error, refetch } = useApps();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    await apiMutate(`/api/apps/${id}`, 'DELETE');
    setDeleting(null);
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Registered Apps</h1>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate('/admin/apps/new')}
        >
          + Add App
        </button>
      </div>

      {!apps?.length ? (
        <div className={styles.empty}>No apps registered yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Display Name</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Route</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Production URL</th>
              <th className={styles.th}>Updated</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className={styles.tr}>
                <td className={styles.td}>{app.display_name}</td>
                <td className={`${styles.td} ${styles.mono}`}>{app.name}</td>
                <td className={`${styles.td} ${styles.mono}`}>
                  {app.active_rule}
                </td>
                <td className={styles.td}>
                  <StatusBadge status={app.status} />
                </td>
                <td className={`${styles.td} ${styles.mono}`}>
                  {app.entry_production || '-'}
                </td>
                <td className={styles.td}>
                  {new Date(app.updated_at).toLocaleDateString()}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={styles.btnGhost}
                      onClick={() => navigate(`/admin/apps/${app.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.btnDanger}
                      onClick={() => setDeleting(app.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleting && (
        <ConfirmDialog
          message="Are you sure you want to delete this app? All deployment records will also be removed."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
