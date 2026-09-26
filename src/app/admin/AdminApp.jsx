'use client';

import React, { useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminApp() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <>
      <div className="noise-overlay"></div>
      {!isAdminLoggedIn ? (
        <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
      ) : (
        <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
      )}
    </>
  );
}
