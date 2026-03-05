import { useState } from 'react';
import { useDeployments } from '../hooks/useDeployments';
import { useApps } from '../hooks/useApps';
import { apiMutate } from '../hooks/useApi';
import type { DeploymentRecord } from '@wlp/shared';
import StatusBadge from '../components/StatusBadge';
import styles from './AdminDeployments.module.css';

export default function AdminDeployments() {
  const { data: deployments, loading, error, refetch } = useDeployments();
  const { data: apps } = useApps();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    app_id: '',
    environment: 'test',
    version: '',
    url: '',
    status: 'success' as DeploymentRecord['status'],
    deployed_by: 'manual',
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiMutate('/api/deployments', 'POST', form);
    if (res.error) return;
    setShowForm(false);
    setForm({
      app_id: '',
      environment: 'test',
      version: '',
      url: '',
      status: 'success',
      deployed_by: 'manual',
      notes: '',
    });
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Deployment History</h1>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Record Deployment'}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              App
              <select
                className={styles.formInput}
                value={form.app_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, app_id: e.target.value }))
                }
                required
              >
                <option value="">Select app...</option>
                {apps?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.display_name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.formLabel}>
              Environment
              <select
                className={styles.formInput}
                value={form.environment}
                onChange={(e) =>
                  setForm((f) => ({ ...f, environment: e.target.value }))
                }
              >
                <option value="test">Test</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </label>
            <label className={styles.formLabel}>
              Version
              <input
                className={styles.formInput}
                value={form.version}
                onChange={(e) =>
                  setForm((f) => ({ ...f, version: e.target.value }))
                }
                placeholder="v1.0.0 or git SHA"
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              URL
              <input
                className={styles.formInput}
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://..."
              />
            </label>
            <label className={styles.formLabel}>
              Status
              <select
                className={styles.formInput}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as DeploymentRecord['status'],
                  }))
                }
              >
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="in_progress">In Progress</option>
                <option value="rollback">Rollback</option>
              </select>
            </label>
            <label className={styles.formLabel}>
              Notes
              <input
                className={styles.formInput}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Optional notes"
              />
            </label>
          </div>
          <button type="submit" className={styles.btnPrimary}>
            Save Record
          </button>
        </form>
      )}

      {!deployments?.length ? (
        <div className={styles.empty}>No deployment records yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>App</th>
              <th className={styles.th}>Environment</th>
              <th className={styles.th}>Version</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Deployed By</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((d) => (
              <tr key={d.id}>
                <td className={styles.td}>
                  {d.app?.display_name ?? d.app_id}
                </td>
                <td className={styles.td}>{d.environment}</td>
                <td className={`${styles.td} ${styles.mono}`}>
                  {d.version || '-'}
                </td>
                <td className={styles.td}>
                  <StatusBadge status={d.status} />
                </td>
                <td className={styles.td}>{d.deployed_by}</td>
                <td className={styles.td}>
                  {new Date(d.deployed_at).toLocaleString()}
                </td>
                <td className={styles.td}>{d.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
