'use client';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🧾' },
  { id: 'ai', label: 'AI', icon: '✨' },
  { id: 'actions', label: 'Actions', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      backgroundColor: '#0f172a',
      borderTop: '1px solid #1e293b',
      gap: 0,
    }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '8px',
            backgroundColor: activeTab === item.id ? '#1d4ed8' : 'transparent',
            border: 'none',
            color: activeTab === item.id ? '#fff' : '#cbd5e1',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === item.id ? '700' : '400',
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
