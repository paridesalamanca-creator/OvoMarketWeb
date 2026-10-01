'use client';

import { useEffect, useState } from 'react';
import SecureStorage from '@/lib/storage';
import OnboardingScreen from '@/components/OnboardingScreen';
import DashboardScreen from '@/components/DashboardScreen';
import ProductsScreen from '@/components/ProductsScreen';
import OrdersScreen from '@/components/OrdersScreen';
import AIScreen from '@/components/AIScreen';
import ActionCenterScreen from '@/components/ActionCenterScreen';
import SettingsScreen from '@/components/SettingsScreen';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const checkConfig = async () => {
      const domain = await SecureStorage.getItem('shopify_domain');
      const token = await SecureStorage.getItem('shopify_token');
      const aiKey = await SecureStorage.getItem('ai_api_key');
      setConfigured(!!(domain && token && aiKey));
      setLoading(false);
    };
    checkConfig();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0b1020',
        color: '#fff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚙️</div>
          <p>Loading Ovo Market...</p>
        </div>
      </div>
    );
  }

  if (!configured) {
    return <OnboardingScreen onConfigured={() => setConfigured(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'ai':
        return <AIScreen />;
      case 'actions':
        return <ActionCenterScreen />;
      case 'settings':
        return <SettingsScreen onDisconnect={() => setConfigured(false)} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0b1020',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
