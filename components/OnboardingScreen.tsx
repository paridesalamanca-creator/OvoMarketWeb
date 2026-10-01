'use client';

import { useState } from 'react';
import SecureStorage from '@/lib/storage';

const defaultModel = 'gpt-3.5-turbo';
const defaultBaseUrl = 'https://api.openai.com/v1/chat/completions';

export default function OnboardingScreen({ onConfigured }) {
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [aiKey, setAiKey] = useState('');
  const [aiModel, setAiModel] = useState(defaultModel);
  const [aiBaseUrl, setAiBaseUrl] = useState(defaultBaseUrl);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const cleanDomain = domain.trim();
    const cleanToken = token.trim();
    const cleanKey = aiKey.trim();

    if (!cleanDomain || !cleanToken || !cleanKey) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await SecureStorage.setItem('shopify_domain', cleanDomain);
      await SecureStorage.setItem('shopify_token', cleanToken);
      await SecureStorage.setItem('ai_api_key', cleanKey);
      await SecureStorage.setItem('ai_model', aiModel || defaultModel);
      await SecureStorage.setItem('ai_base_url', aiBaseUrl || defaultBaseUrl);
      setError('');
      onConfigured();
    } catch (e) {
      setError('Failed to save credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0b1020',
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏪</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Ovo Market</h1>
          <p style={{ margin: '0', color: '#cbd5e1', fontSize: '16px' }}>AI Command Center</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <input
            type="text"
            placeholder="Shopify store domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={{
              padding: '12px 14px',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          <input
            type="password"
            placeholder="Shopify Admin API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              padding: '12px 14px',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          <input
            type="password"
            placeholder="AI API key"
            value={aiKey}
            onChange={(e) => setAiKey(e.target.value)}
            style={{
              padding: '12px 14px',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="AI model"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            style={{
              padding: '12px 14px',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="AI base URL"
            value={aiBaseUrl}
            onChange={(e) => setAiBaseUrl(e.target.value)}
            style={{
              padding: '12px 14px',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid #dc2626',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading}
            style={{
              padding: '12px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Connecting...' : 'Connect Ovo Market'}
          </button>
        </div>
      </div>
    </div>
  );
}
