import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulación de "Procesando..." para dar feedback visual solo si hay intento
    setIsChecking(true);

    setTimeout(() => {
        // VALIDACIÓN "SILENCIOSA"
        if (password === 'matukana.2026') {
            // 1. Éxito: Feedback positivo y entrada
            toast({
                title: "Identidad Confirmada",
                description: "Bienvenido al centro de control, Agustín.",
                className: "bg-stone-900 text-white border-stone-800"
            });
            onLogin();
        } else {
            // 2. Fallo: SILENCIO ABSOLUTO.
            // Solo limpiamos el campo y quitamos el loading. 
            // El intruso no sabe si falló la conexión, la pass o el sistema.
            setPassword('');
            setIsChecking(false);
        }
    }, 800); // Pequeño delay dramático de 0.8s
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo Tech/Natural (Patrón de puntos) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
      
      {/* Decoración de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-10 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 border border-stone-100 p-4">
             {/* Logo Matukana */}
             <img 
                src="https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/matukana/matukanaicon.png" 
                alt="Matukana" 
                className="w-full h-full object-contain"
             />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">Acceso Restringido</h1>
          <p className="text-stone-500 text-sm mt-2 font-medium uppercase tracking-widest">Solo Personal Autorizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-center text-lg tracking-[0.5em] focus:ring-2 focus:ring-amber-900/10 focus:border-amber-900 transition-all outline-none placeholder:tracking-normal"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!password || isChecking}
            className="w-full bg-stone-900 hover:bg-black text-white h-12 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isChecking ? (
                <Loader2 className="animate-spin" />
            ) : (
                <span className="flex items-center">
                    Desbloquear Sistema <ArrowRight size={16} className="ml-2" />
                </span>
            )}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => window.location.hash = ''}
              className="text-xs text-stone-400 hover:text-amber-700 transition-colors uppercase tracking-wider font-bold"
            >
              ← Volver a la Web
            </button>
          </div>

        </form>
      </motion.div>
      
      {/* Footer minimalista */}
      <div className="absolute bottom-6 text-center w-full text-[10px] text-stone-300 font-mono">
        SECURE SYSTEM • MATUKANA ADMIN
      </div>
    </div>
  );
};

export default AdminLogin;