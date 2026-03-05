import { useState } from 'react';
import { useEnvironments } from '../hooks/useEnvironments';
import { apiMutate } from '../hooks/useApi';
import type { EnvironmentRecord } from '@wlp/shared';
import EnvironmentForm from '../components/EnvironmentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import styles from './AdminEnvironments.module.css';

export default function AdminEnvironments() {
  const { data: environments, loading, error, refetch } = useEnvironments();
  const [editing, setEditing] = useState<EnvironmentRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreate(formData: Record<string, unknown>) {
    const res = await apiMutate<EnvironmentRecord>(
      '/api/environments',
      'POST',
      formData,
    );
    if (res.error) throw new Error(res.error);
    setCreating(false);
    refetch();
  }

  async function handleUpdate(formData: Record<string, unknown>) {
    const res = await apiMutate<EnvironmentRecord>(
      `/api/environments/${editing!.id}`,
      'PUT',
      formData,
    );
    if (res.error) throw new Error(res.error);
    setEditing(null);
    refetch();
  }

  async function handleDelete(id: string) {
    await apiMutate(`/api/environments/${id}`, 'DELETE');
    setDeleting(null);
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const showForm = creating || editing;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Environments</h1>
        {!showForm && (
          <button
            className={styles.btnPrimary}
            onClick={() => setCreating(true)}
          >
            + Add Environment
          </button>
        )}
      </div>

      <div className={styles.layout}>
        <div className={styles.list}>
          {!environments?.length ? (
            <div className={styles.empty}>No environments configured.</div>
          ) : (
            environments.map((env) => (
              <div
                key={env.id}
                className={`${styles.card} ${editing?.id === env.id ? styles.cardActive : ''}`}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{env.display_name}</span>
                  <span className={styles.clusterBadge}>{env.cluster}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.mono}>{env.name}</span>
                  {env.domain && (
                    <span className={styles.mono}>{env.domain}</span>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.btnGhost}
                    onClick={() => {
                      setCreating(false);
                      setEditing(env);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.btnDanger}
                    onClick={() => setDeleting(env.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <div className={styles.formPanel}>
            <h2 className={styles.formTitle}>
              {creating ? 'New Environment' : `Edit: ${editing!.display_name}`}
            </h2>
            <EnvironmentForm
              initial={creating ? undefined : editing!}
              onSubmit={creating ? handleCreate : handleUpdate}
              onCancel={() => {
                setCreating(false);
                setEditing(null);
              }}
              isEdit={!creating}
            />
          </div>
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          message="Are you sure you want to delete this environment?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
