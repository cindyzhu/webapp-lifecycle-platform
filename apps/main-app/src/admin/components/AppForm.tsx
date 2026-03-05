import { useState } from 'react';
import type { AppRecord } from '@wlp/shared';
import styles from './AppForm.module.css';

type FormData = {
  name: string;
  display_name: string;
  active_rule: string;
  entry_dev: string;
  entry_test: string;
  entry_staging: string;
  entry_production: string;
  status: AppRecord['status'];
  git_repo: string;
  vercel_project_id: string;
  props: string;
};

interface Props {
  initial?: AppRecord;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

function toFormData(app?: AppRecord): FormData {
  return {
    name: app?.name ?? '',
    display_name: app?.display_name ?? '',
    active_rule: app?.active_rule ?? '/',
    entry_dev: app?.entry_dev ?? '',
    entry_test: app?.entry_test ?? '',
    entry_staging: app?.entry_staging ?? '',
    entry_production: app?.entry_production ?? '',
    status: app?.status ?? 'active',
    git_repo: app?.git_repo ?? '',
    vercel_project_id: app?.vercel_project_id ?? '',
    props: JSON.stringify(app?.props ?? {}, null, 2),
  };
}

export default function AppForm({ initial, onSubmit, onCancel, isEdit }: Props) {
  const [form, setForm] = useState<FormData>(() => toFormData(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      JSON.parse(form.props);
    } catch {
      setError('Props must be valid JSON');
      return;
    }
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
          placeholder="sub-my-app"
        />
      </label>

      <label className={styles.label}>
        Display Name
        <input
          className={styles.input}
          value={form.display_name}
          onChange={(e) => set('display_name', e.target.value)}
          required
          placeholder="My App"
        />
      </label>

      <label className={styles.label}>
        Active Rule
        <input
          className={styles.input}
          value={form.active_rule}
          onChange={(e) => set('active_rule', e.target.value)}
          required
          placeholder="/my-app"
        />
      </label>

      <label className={styles.label}>
        Status
        <select
          className={styles.input}
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </label>

      <div className={styles.sectionTitle}>Entry URLs</div>

      <label className={styles.label}>
        Dev
        <input
          className={styles.input}
          value={form.entry_dev}
          onChange={(e) => set('entry_dev', e.target.value)}
          placeholder="http://localhost:5176"
        />
      </label>

      <div className={styles.row}>
        <label className={styles.label}>
          Test
          <input
            className={styles.input}
            value={form.entry_test}
            onChange={(e) => set('entry_test', e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className={styles.label}>
          Staging
          <input
            className={styles.input}
            value={form.entry_staging}
            onChange={(e) => set('entry_staging', e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <label className={styles.label}>
        Production
        <input
          className={styles.input}
          value={form.entry_production}
          onChange={(e) => set('entry_production', e.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className={styles.sectionTitle}>CI/CD (Optional)</div>

      <label className={styles.label}>
        Git Repository
        <input
          className={styles.input}
          value={form.git_repo}
          onChange={(e) => set('git_repo', e.target.value)}
          placeholder="https://github.com/org/repo"
        />
      </label>

      <label className={styles.label}>
        Vercel Project ID
        <input
          className={styles.input}
          value={form.vercel_project_id}
          onChange={(e) => set('vercel_project_id', e.target.value)}
          placeholder="prj_xxxx"
        />
      </label>

      <label className={styles.label}>
        Props (JSON)
        <textarea
          className={styles.textarea}
          value={form.props}
          onChange={(e) => set('props', e.target.value)}
          rows={3}
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
