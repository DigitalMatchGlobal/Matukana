'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const MINIMO = 8;

/**
 * Cambio de contraseña desde adentro del panel.
 *
 * Usa `supabase.auth.updateUser`, que opera sobre la sesión ya abierta: no manda
 * ningún correo ni depende del SMTP, que todavía no está configurado. Es la vía
 * para que Agus se saque de encima la contraseña temporal.
 */
export default function CambiarPassword() {
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState('');
  const [repetida, setRepetida] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | guardando | ok
  const [error, setError] = useState('');
  const { toast } = useToast();

  const cerrar = () => {
    setAbierto(false);
    setPassword('');
    setRepetida('');
    setError('');
    setEstado('idle');
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < MINIMO) {
      setError(`La contraseña tiene que tener al menos ${MINIMO} caracteres.`);
      return;
    }
    if (password !== repetida) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }

    setEstado('guardando');
    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      // El caso más común: Supabase rechaza una contraseña que ya se usó o muy débil.
      setError(err.message || 'No se pudo cambiar la contraseña. Probá de nuevo.');
      setEstado('idle');
      return;
    }

    setEstado('ok');
    toast({
      title: 'Contraseña actualizada',
      description: 'Usá la nueva la próxima vez que entres.',
      className: 'bg-stone-900 text-white border-stone-800',
    });
    setTimeout(cerrar, 1200);
  };

  return (
    <>
      <Button
        onClick={() => setAbierto(true)}
        variant="ghost"
        size="sm"
        className="text-stone-600 hover:text-amber-700"
      >
        <KeyRound size={16} className="md:mr-2" />
        <span className="hidden md:inline">Contraseña</span>
      </Button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={cerrar}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={cerrar}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Cambiar contraseña
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Mínimo {MINIMO} caracteres. La vas a usar la próxima vez que entres.
                </p>
              </div>

              <form onSubmit={guardar} className="space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={estado !== 'idle'}
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm focus:ring-0 focus:border-stone-900 transition-all outline-none"
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                  autoFocus
                  required
                />
                <input
                  type="password"
                  value={repetida}
                  onChange={(e) => setRepetida(e.target.value)}
                  disabled={estado !== 'idle'}
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm focus:ring-0 focus:border-stone-900 transition-all outline-none"
                  placeholder="Repetila"
                  autoComplete="new-password"
                  required
                />

                {error && (
                  <p className="text-red-600 text-xs font-medium pt-1">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={estado !== 'idle'}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-5 mt-1"
                >
                  {estado === 'guardando' ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : estado === 'ok' ? (
                    <span className="flex items-center gap-2">
                      <Check size={16} /> Listo
                    </span>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
