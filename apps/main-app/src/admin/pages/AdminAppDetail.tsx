import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useDeployments } from '../hooks/useDeployments';
import { apiMutate } from '../hooks/useApi';
import type { AppRecord } from '@wlp/shared';
import AppForm from '../components/AppForm';
import StatusBadge from '../components/StatusBadge';
import UploadDeploy from '../components/UploadDeploy';
import styles from './AdminAppDetail.module.css';

export default function AdminAppDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const { data: app, loading, error } = useApp(isNew ? '' : id!);
  const { data: deployments, refetch: refetchDeployments } = useDeployments(isNew ? undefined : id);

  async function handleSubmit(formData: Record<string, unknown>) {
    const body = {
      ...formData,
      props: JSON.parse(formData.props as string),
    };

    if (isNew) {
      const res = await apiMutate<AppRecord>('/api/apps', 'POST', body);
      if (res.error) throw new Error(res.error);
      navigate('/admin/apps');
    } else {
      const res = await apiMutate<AppRecord>(`/api/apps/${id}`, 'PUT', body);
      if (res.error) throw new Error(res.error);
      navigate('/admin/apps');
    }
  }

  if (!isNew && loading)
    return <div className={styles.loading}>Loading...</div>;
  if (!isNew && error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{isNew ? 'Add New App' : `Edit: ${app?.display_name}`}</h1>

      <AppForm
        initial={isNew ? undefined : app!}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/apps')}
        isEdit={!isNew}
      />

      {!isNew && id && (
        <UploadDeploy appId={id} onDeployed={refetchDeployments} />
      )}

      {!isNew && deployments && deployments.length > 0 && (
        <div className={styles.deploymentsSection}>
          <h2 className={styles.subtitle}>Deployment History</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Environment</th>
                <th className={styles.th}>Version</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Deployed By</th>
                <th className={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
