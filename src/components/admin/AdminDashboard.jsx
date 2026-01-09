import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Package, Heart, Sparkles, MessageSquare, RefreshCcw, Image as ImageIcon, ExternalLink, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InquiryCard from '@/components/admin/InquiryCard';
import ProductManager from '@/components/admin/ProductManager';
import TherapyManager from '@/components/admin/TherapyManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import GalleryManager from '@/components/admin/GalleryManager';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = ({ onLogout }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inquiries");
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();

    // Set up realtime subscription
    const subscription = supabase
      .channel('inquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, payload => {
        loadInquiries();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar",
        description: error.message
      });
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const updateInquiryStatus = async (id, newStatus) => {
    // Optimistic update
    setInquiries(prev => prev.map(inq => 
      inq.id === id ? { ...inq, status: newStatus } : inq
    ));

    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudo cambiar el estado."
      });
      loadInquiries();
    }
  };

  const getStats = () => {
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === 'new').length;
    const contacted = inquiries.filter(i => i.status === 'contacted').length;
    return { total, newCount, contacted };
  };

  const stats = getStats();

  const handleBackToSite = () => {
    window.location.hash = '';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="min-h-screen bg-stone-50/50">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo pequeño */}
             <div className="bg-amber-100/50 p-1.5 rounded-lg">
                <img 
                    src="https://xwotrjojocxpjwalanqh.supabase.co/storage/v1/object/public/media/matukana/matukanaicon.png" 
                    alt="Logo" 
                    className="w-6 h-6 object-contain"
                />
             </div>
             <div>
                <h1 className="text-lg font-bold text-stone-900 leading-tight">Matukana Admin</h1>
                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Panel de Control</p>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBackToSite}
              variant="ghost"
              size="sm"
              className="text-stone-600 hover:text-amber-700 hidden md:flex"
            >
              <ExternalLink size={16} className="mr-2" />
              Ver Sitio
            </Button>
            <div className="h-6 w-px bg-stone-200 hidden md:block mx-1"></div>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {/* --- BIENVENIDA --- */}
        <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-800">
                {getGreeting()}, Agustín.
            </h2>
            <p className="text-stone-500">Aquí tienes el resumen de hoy.</p>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Consultas" 
            value={stats.total} 
            icon={<MessageSquare size={20} />} 
            color="bg-blue-50 text-blue-700"
          />
          <StatCard 
            title="Nuevas (Pendientes)" 
            value={stats.newCount} 
            icon={<Sparkles size={20} />} 
            color="bg-amber-50 text-amber-700"
            highlight={stats.newCount > 0}
          />
          <StatCard 
            title="Contactadas" 
            value={stats.contacted} 
            icon={<RefreshCcw size={20} />} 
            color="bg-green-50 text-green-700"
          />
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          
          {/* Navegación de Pestañas (Scrollable en móvil) */}
          <div className="w-full overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="bg-white border border-stone-200 p-1.5 h-auto inline-flex min-w-max rounded-xl shadow-sm">
                <TabItem value="inquiries" icon={<LayoutDashboard size={16} />} label="Consultas" />
                <TabItem value="products" icon={<Package size={16} />} label="Productos" />
                <TabItem value="therapies" icon={<Heart size={16} />} label="Terapias" />
                <TabItem value="experiences" icon={<Sparkles size={16} />} label="Experiencias" />
                <TabItem value="gallery" icon={<ImageIcon size={16} />} label="Galería" />
            </TabsList>
          </div>

          {/* --- PESTAÑA: CONSULTAS --- */}
          <TabsContent value="inquiries" className="space-y-4 focus-visible:ring-0">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-stone-400" />
                  Buzón de Mensajes
               </h3>
               <Button onClick={loadInquiries} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <RefreshCcw size={14} className={loading ? 'animate-spin text-stone-400' : 'text-stone-400'} />
               </Button>
            </div>

            {loading ? (
               <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div></div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-12 text-center">
                <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-stone-300" size={32} />
                </div>
                <p className="text-stone-500 font-medium">No hay consultas pendientes</p>
                <p className="text-stone-400 text-sm">Todo está al día por aquí.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {inquiries.map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    onStatusChange={updateInquiryStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* --- OTROS PANELES --- */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 min-h-[400px]">
            <TabsContent value="products" className="mt-0 focus-visible:ring-0">
                <ProductManager />
            </TabsContent>

            <TabsContent value="therapies" className="mt-0 focus-visible:ring-0">
                <TherapyManager />
            </TabsContent>

            <TabsContent value="experiences" className="mt-0 focus-visible:ring-0">
                <ExperienceManager />
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 focus-visible:ring-0">
                <GalleryManager />
            </TabsContent>
          </div>

        </Tabs>
      </main>
    </div>
  );
};

// --- COMPONENTES AUXILIARES PARA LIMPIEZA ---

const StatCard = ({ title, value, icon, color, highlight }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white p-5 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between ${highlight ? 'ring-2 ring-amber-100' : ''}`}
    >
        <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-bold text-stone-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
    </motion.div>
);

const TabItem = ({ value, icon, label }) => (
    <TabsTrigger 
        value={value} 
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-stone-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-stone-600 font-medium"
    >
        {icon}
        <span>{label}</span>
    </TabsTrigger>
);

export default AdminDashboard;