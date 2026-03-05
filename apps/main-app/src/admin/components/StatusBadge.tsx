import styles from './StatusBadge.module.css';

type Status =
  | 'active'
  | 'inactive'
  | 'deprecated'
  | 'success'
  | 'failed'
  | 'rollback'
  | 'in_progress';

const COLOR_MAP: Record<Status, string> = {
  active: styles.green,
  success: styles.green,
  inactive: styles.gray,
  deprecated: styles.gray,
  in_progress: styles.blue,
  failed: styles.red,
  rollback: styles.orange,
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${COLOR_MAP[status] || styles.gray}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
