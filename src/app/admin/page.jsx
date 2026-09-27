import React from 'react';
import AdminApp from './AdminApp';

// El panel no se indexa. En Vite esto dependía de que react-helmet inyectara
// el meta robots del lado del cliente — un crawler que no ejecuta JS lo perdía.
export const metadata = {
  title: 'Admin',
  description: 'Panel de administración',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminApp />;
}
