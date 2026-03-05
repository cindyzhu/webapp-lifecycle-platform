import { useState } from 'react';
import type { EnvironmentRecord } from '@wlp/shared';
import styles from './AppForm.module.css';

type FormData = {
  name: string;
  display_name: string;
  domain: string;
  cluster: EnvironmentRecord['cluster'];
  sort_order: number;
};

interface Props {
  initial?: EnvironmentRecord;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

function toFormData(env?: EnvironmentRecord): FormData {
  return {
    name: env?.name ?? '',
    display_name: env?.display_name ?? '',
    domain: env?.domain ?? '',
    cluster: env?.cluster ?? 'shared',
    sort_order: env?.sort_order ?? 0,
  };
}

export default function EnvironmentForm({
  initial,
  onSubmit,
  onCancel,
  isEdit,
}: Props) {
  const [form, setForm] = useState<FormData>(() => toFormData(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>
        Name
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
          disabled={isEdit}
          placeholder="production"
        />
      </label>

      <label className={styles.label}>
        Display Name
        <input
          className={styles.input}
          value={form.display_name}
          onChange={(e) => set('display_name', e.target.value)}
          required
          placeholder="Production"
        />
      </label>

      <label className={styles.label}>
        Domain
        <input
          className={styles.input}
          value={form.domain}
          onChange={(e) => set('domain', e.target.value)}
          placeholder="app.example.com"
        />
      </label>

      <label className={styles.label}>
        Cluster
        <select
          className={styles.input}
          value={form.cluster}
          onChange={(e) =>
            set('cluster', e.target.value as EnvironmentRecord['cluster'])
          }
        >
          <option value="shared">Shared</option>
          <option value="dedicated">Dedicated</option>
        </select>
      </label>

      <label className={styles.label}>
        Sort Order
        <input
          className={styles.input}
          type="number"
          value={form.sort_order}
          onChange={(e) => set('sort_order', Number(e.target.value))}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
