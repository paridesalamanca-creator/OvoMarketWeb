'use client';

export default function ActionCenterScreen() {
  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>Action Center</h1>

      <div style={{
        textAlign: 'center',
        padding: '32px',
        color: '#cbd5e1',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
        <p>No Pending Actions</p>
        <p style={{ fontSize: '13px', margin: '8px 0 0 0' }}>
          Any destructive action requires explicit confirmation
        </p>
      </div>
    </div>
  );
}
