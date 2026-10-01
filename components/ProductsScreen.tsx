'use client';

import { useEffect, useState } from 'react';
import ShopifyClient from '@/lib/shopify';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const shopify = new ShopifyClient();
        const prods = await shopify.getProducts();
        setProducts(prods);
      } catch (e) {
        setError('DATA NOT AVAILABLE');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          backgroundColor: '#111827',
          border: '1px solid #334155',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          marginBottom: '16px',
          boxSizing: 'border-box',
        }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>Loading...</div>
      ) : error ? (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          padding: '16px',
          color: '#fca5a5',
          textAlign: 'center',
        }}>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          color: '#cbd5e1',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
          <p>No products found</p>
        </div>
      ) : (
        <div>
          {filtered.map((product, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#111827',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>{product.title}</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
                Status: {product.status}
              </div>
              {product.price && (
                <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
                  Price: ${product.price.toFixed(2)}
                </div>
              )}
              {product.inventory !== undefined && (
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Inventory: {product.inventory} units
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
