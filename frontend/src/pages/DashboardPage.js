import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>
        👋 Mirësevjen, {user?.email?.split('@')[0] || 'Vullnetar'}!
      </h1>
      <p>Kjo është faqja juaj e personalizuar e Dashboard-it.</p>
    </div>
  );
}

export default DashboardPage;
