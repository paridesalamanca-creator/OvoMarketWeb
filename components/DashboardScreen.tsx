'use client';

import { useEffect, useState } from 'react';
import ShopifyClient from '@/lib/shopify';

const MetricCard = ({ label, value, detail }) => (
  <div style={{
    backgroundColor: '#111827',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '12px',
  }}>
    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{label}</div>
    <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>
      {value || 'DATA NOT AVAILABLE'}
    </div>
    {detail && <div style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '4px' }}>{detail}</div>}
  </div>
);

export default function DashboardScreen() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const shopify = new ShopifyClient();
      const [store, prods, ords] = await Promise.all([
        shopify.getStoreInfo(),
        shopify.getProducts(),
        shopify.getOrders(),
      ]);
      setStoreInfo(store);
      setProducts(prods);
      setOrders(ords);
    } catch (e) {
      setError('DATA NOT AVAILABLE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const inventory = products.reduce((sum, prod) => sum + (prod.inventory || 0), 0);

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Dashboard</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          padding: '16px',
          color: '#fca5a5',
        }}>
          {error}
        </div>
      ) : (
        <>
          {storeInfo && (
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700' }}>
                {storeInfo.name}
              </h2>
              <p style={{ margin: '0', color: '#cbd5e1', fontSize: '13px' }}>{storeInfo.domain}</p>
              {storeInfo.email && (
                <p style={{ margin: '4px 0 0 0', color: '#cbd5e1', fontSize: '13px' }}>
                  {storeInfo.email}
                </p>
              )}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <MetricCard label="Products" value={products.length} />
            <MetricCard label="Orders" value={orders.length} />
            <MetricCard label="Revenue" value={revenue > 0 ? `$${revenue.toFixed(0)}` : 'N/A'} detail="Retrieved orders" />
            <MetricCard label="Inventory" value={inventory} />
          </div>

          <button
            onClick={loadData}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            Refresh Store
          </button>
        </>
      )}
    </div>
  );
}
