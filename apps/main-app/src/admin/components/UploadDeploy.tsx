import { useState, useRef } from 'react';
import { apiMutate } from '../hooks/useApi';
import styles from './UploadDeploy.module.css';

interface Props {
  appId: string;
  onDeployed: () => void;
}

export default function UploadDeploy({ appId, onDeployed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState('test');
  const [version, setVersion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file || !version) return;
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Read file as base64
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), ''),
      );

      const res = await apiMutate<{ url: string; files: number }>(
        '/api/upload',
        'POST',
        { app_id: appId, environment, version, file: base64 },
      );

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(`Deployed to ${environment}: ${res.data?.url}`);
        setFile(null);
        setVersion('');
        if (inputRef.current) inputRef.current.value = '';
        onDeployed();
      }
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.zip')) {
      setFile(dropped);
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Upload Static Build</h3>

      <div
        className={`${styles.dropzone} ${file ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <span>{file.name} ({(file.size / 1024).toFixed(0)} KB)</span>
        ) : (
          <span>Drop dist.zip here or click to select</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Environment</label>
          <select
            className={styles.select}
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="test">Test</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Version</label>
          <input
            className={styles.input}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0.0"
          />
        </div>
        <button
          className={styles.btn}
          onClick={handleUpload}
          disabled={!file || !version || uploading}
        >
          {uploading ? 'Uploading...' : 'Deploy'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
    </div>
  );
}
