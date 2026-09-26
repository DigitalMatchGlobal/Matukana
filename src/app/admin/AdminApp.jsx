'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { supabase } from '@/lib/customSupabaseClient';

// La sesión la maneja Supabase Auth, no un useState suelto: antes el "login"
// era un booleano en memoria que se perdía en cada refresh (y que no
// autorizaba nada contra la base). Ver docs/MIGRACION-NEXT.md.
export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    // Cubre login, logout, refresh del token y el cierre de sesión hecho
    // desde otra pestaña.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="noise-overlay"></div>
      {!session ? (
        // onLogin queda por compatibilidad con el componente: el estado real
        // llega igual por onAuthStateChange.
        <AdminLogin onLogin={() => {}} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  );
}
