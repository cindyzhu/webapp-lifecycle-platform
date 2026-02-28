import { useState } from 'react';

const mockGoods = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, stock: 320, category: 'Electronics' },
  { id: 2, name: 'Cotton T-Shirt', price: 19.99, stock: 1500, category: 'Clothing' },
  { id: 3, name: 'Stainless Water Bottle', price: 24.99, stock: 800, category: 'Home' },
  { id: 4, name: 'USB-C Cable 2m', price: 9.99, stock: 5000, category: 'Electronics' },
];

export default function App() {
  const [goods] = useState(mockGoods);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16 }}>Goods Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>ID</th>
            <th style={{ padding: 12 }}>Name</th>
            <th style={{ padding: 12 }}>Category</th>
            <th style={{ padding: 12 }}>Price</th>
            <th style={{ padding: 12 }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((g) => (
            <tr key={g.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 12 }}>{g.id}</td>
              <td style={{ padding: 12 }}>{g.name}</td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: '#f3e5f5',
                    color: '#6a1b9a',
                  }}
                >
                  {g.category}
                </span>
              </td>
              <td style={{ padding: 12 }}>${g.price.toFixed(2)}</td>
              <td style={{ padding: 12 }}>{g.stock.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
