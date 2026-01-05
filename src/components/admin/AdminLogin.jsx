import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple password check (in production, use proper authentication)
    if (password === 'matukana2026') {
      onLogin();
      toast({
        title: "Bienvenido, Agustín",
        description: "Acceso concedido al panel de administración",
      });
    } else {
      toast({
        title: "Acceso denegado",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Lock className="text-amber-900" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-amber-900">Panel de Administración</h1>
          <p className="text-stone-600 mt-2">Matukana</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-900 hover:bg-amber-800 text-white"
          >
            Ingresar
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => window.location.hash = ''}
              className="text-sm text-stone-600 hover:text-amber-900 transition-colors"
            >
              Volver al sitio
            </button>
          </div>

          <div className="text-xs text-stone-500 text-center pt-4 border-t border-stone-200">
            Contraseña de prueba: matukana2026
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;