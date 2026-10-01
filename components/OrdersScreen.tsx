'use client';

import { useEffect, useState } from 'react';
import ShopifyClient from '@/lib/shopify';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const shopify = new ShopifyClient();
        const ords = await shopify.getOrders();
        setOrders(ords);
      } catch (e) {
        setError('DATA NOT AVAILABLE');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Orders</h1>

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
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          color: '#cbd5e1',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧾</div>
          <p>No orders found</p>
        </div>
      ) : (
        <div>
          {orders.map((order, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#111827',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>{order.name}</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div style={{ color: '#7dd3fc', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                ${order.total.toFixed(2)} {order.currency}
              </div>
              {order.financialStatus && (
                <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '2px' }}>
                  Financial: {order.financialStatus}
                </div>
              )}
              {order.fulfillmentStatus && (
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Fulfillment: {order.fulfillmentStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
