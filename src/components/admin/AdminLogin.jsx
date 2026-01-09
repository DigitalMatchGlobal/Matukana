import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Loader2, ScanFace, CheckCircle2, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | success | error
  const { toast } = useToast();

  // --- LOGICA DE EFECTO 3D ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Suavizado del movimiento para que parezca flotar en agua/aire
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Transformar posición del mouse en rotación (Tilt Effect)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setStatus('checking');

    // Simulación de "Procesamiento Cuántico" ;)
    setTimeout(() => {
        if (password === 'matukana.2026') {
            setStatus('success');
            // Sonido o vibración háptica si fuera móvil
            if (navigator.vibrate) navigator.vibrate(50);
            
            setTimeout(() => {
                toast({
                    title: "Acceso Concedido",
                    description: "Bienvenido al Sistema de Matukana.",
                    className: "bg-stone-900 text-white border-stone-800"
                });
                onLogin();
            }, 1000); // Esperar a que termine la animación de éxito
        } else {
            setStatus('error');
            setTimeout(() => {
                setPassword('');
                setStatus('idle');
            }, 500);
        }
    }, 1200); 
  };

  return (
    <div 
        className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 relative overflow-hidden perspective-1000"
        onMouseMove={handleMouseMove}
    >
      
      {/* Fondo Tech Dinámico */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      
      {/* Luz ambiental que sigue el mouse (Glow sutil) */}
      <motion.div 
        style={{ x: mouseX, y: mouseY }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-100/30 to-blue-100/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />

      {/* --- TARJETA 3D INTERACTIVA --- */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 p-10 relative overflow-hidden group">
            
            {/* EFECTO DE ESCANEO (Luz que pasa) */}
            <motion.div 
                initial={{ top: "-100%" }}
                animate={status === 'checking' || status === 'success' ? { top: "200%" } : { top: "-100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-amber-400/20 to-transparent z-0 pointer-events-none"
            />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 border border-stone-100 p-4 relative">
                        {/* Icono animado según estado */}
                        <AnimatePresenceMode>
                            {status === 'success' ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                                </motion.div>
                            ) : status === 'checking' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <ScanFace className="text-amber-600 w-10 h-10" />
                                </motion.div>
                            ) : (
                                <img 
                                    src="https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/matukana/matukanaicon.png" 
                                    alt="Matukana" 
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </AnimatePresenceMode>
                    </div>
                    
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">
                        Matukana
                    </h1>
                    <p className="text-stone-400 text-xs mt-2 font-bold uppercase tracking-[0.2em]">
                        Access Admin
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2 relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={status === 'checking' || status === 'success'}
                            className={`w-full px-4 py-4 bg-stone-50 border-2 rounded-xl text-center text-lg tracking-[0.5em] focus:ring-0 focus:border-stone-900 transition-all outline-none placeholder:tracking-normal ${status === 'error' ? 'border-red-300 bg-red-50 animate-shake' : 'border-stone-100'}`}
                            placeholder="••••••••"
                            autoFocus
                        />
                        {status === 'error' && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs text-center mt-2 font-medium">
                                Credencial Inválida
                            </motion.p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!password || status !== 'idle'}
                        className={`w-full h-14 rounded-xl text-sm font-bold tracking-wider transition-all duration-500 shadow-xl ${
                            status === 'success' 
                            ? 'bg-green-600 hover:bg-green-700 scale-105' 
                            : 'bg-stone-900 hover:bg-black hover:scale-[1.02]'
                        }`}
                    >
                        {status === 'checking' ? (
                            <span className="flex items-center gap-2">VERIFICANDO <Loader2 className="animate-spin" size={16}/></span>
                        ) : status === 'success' ? (
                            <span className="flex items-center gap-2">AUTORIZADO <Lock size={16} /></span>
                        ) : (
                            <span className="flex items-center gap-2">DESBLOQUEAR <ArrowRight size={16} /></span>
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => window.location.hash = ''}
                            className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest font-semibold"
                        >
                            Cancelar y volver
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </motion.div>
      
      {/* --- FIRMA DIGITAL MATCH GLOBAL (ANIMADA) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-stone-400 uppercase tracking-widest">Engineered by</span>
        
        <a 
            href="https://www.digitalmatchglobal.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative px-5 py-2 rounded-full bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex items-center gap-2 overflow-hidden"
        >
            {/* Gradiente de fondo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icono Rayo */}
            <div className="relative p-1 bg-stone-100 rounded-full group-hover:bg-white transition-colors">
                <Zap size={12} className="text-stone-400 group-hover:text-[#6D5DFE] group-hover:fill-[#6D5DFE] transition-all" />
            </div>

            {/* Texto Gradiente Tech */}
            <span className="relative text-xs font-bold text-stone-600 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#6D5DFE] transition-all">
                DIGITAL MATCH GLOBAL
            </span>
        </a>
      </motion.div>

    </div>
  );
};

// Pequeño helper para animaciones condicionales limpias
const AnimatePresenceMode = ({ children }) => (
    <div className="relative w-10 h-10 flex items-center justify-center">
        {children}
    </div>
);

export default AdminLogin;