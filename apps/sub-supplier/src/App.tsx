import { useState } from 'react';

const mockSuppliers = [
  { id: 1, name: 'Supplier Alpha', contact: 'alice@alpha.com', status: 'Active' },
  { id: 2, name: 'Supplier Beta', contact: 'bob@beta.com', status: 'Active' },
  { id: 3, name: 'Supplier Gamma', contact: 'carol@gamma.com', status: 'Inactive' },
];

export default function App() {
  const [suppliers] = useState(mockSuppliers);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>Supplier Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>ID</th>
            <th style={{ padding: 12 }}>Name</th>
            <th style={{ padding: 12 }}>Contact</th>
            <th style={{ padding: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 12 }}>{s.id}</td>
              <td style={{ padding: 12 }}>{s.name}</td>
              <td style={{ padding: 12 }}>{s.contact}</td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: s.status === 'Active' ? '#e8f5e9' : '#fce4ec',
                    color: s.status === 'Active' ? '#2e7d32' : '#c62828',
                  }}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
