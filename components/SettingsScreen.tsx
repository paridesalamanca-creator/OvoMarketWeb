'use client';

import { useEffect, useState } from 'react';
import SecureStorage from '@/lib/storage';

export default function SettingsScreen({ onDisconnect }) {
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [aiBaseUrl, setAiBaseUrl] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const domain = await SecureStorage.getItem('shopify_domain');
      const model = await SecureStorage.getItem('ai_model');
      const url = await SecureStorage.getItem('ai_base_url');
      if (domain) setShopifyDomain(domain);
      if (model) setAiModel(model);
      if (url) setAiBaseUrl(url);
    };
    loadSettings();
  }, []);

  const handleDisconnect = async () => {
    if (window.confirm('Disconnect Shopify? You will need to reconfigure to continue.')) {
      await Promise.all([
        SecureStorage.removeItem('shopify_domain'),
        SecureStorage.removeItem('shopify_token'),
        SecureStorage.removeItem('ai_api_key'),
        SecureStorage.removeItem('ai_model'),
        SecureStorage.removeItem('ai_base_url'),
      ]);
      onDisconnect();
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Settings</h1>

      <div style={{
        backgroundColor: '#111827',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>Shopify</h2>
        <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '8px' }}>
          Domain: {shopifyDomain || 'DATA NOT AVAILABLE'}
        </div>
        <div style={{ color: '#7dd3fc', fontSize: '13px', marginBottom: '12px' }}>✓ Connected</div>
        <button
          onClick={handleDisconnect}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Disconnect Shopify
        </button>
      </div>

      <div style={{
        backgroundColor: '#111827',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>AI</h2>
        <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
          Model: {aiModel || 'DATA NOT AVAILABLE'}
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
          Base URL: {aiBaseUrl || 'DATA NOT AVAILABLE'}
        </div>
      </div>

      <div style={{
        backgroundColor: '#111827',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700' }}>App</h2>
        <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>Version: 1.0.0</div>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
          Ovo Market AI Command Center © 2024
        </p>
      </div>
    </div>
  );
}
