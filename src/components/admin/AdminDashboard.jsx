import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Package, Heart, Sparkles, MessageSquare, Plus, RefreshCcw, Image as ImageIcon } from 'lucide-react';
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
        description: "No se pudo cambiar el estado. Intente nuevamente."
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

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Panel de Administración</h1>
              <p className="text-sm text-stone-600">Gestión de Contenidos y Consultas</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={loadInquiries}
                variant="ghost"
                size="icon"
                className="text-stone-500"
                title="Actualizar datos"
              >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              </Button>
              <Button
                onClick={handleBackToSite}
                variant="outline"
                className="text-stone-700 border-stone-300 hidden md:flex"
              >
                Ver Sitio
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="text-stone-700 border-stone-300"
              >
                <LogOut size={18} className="mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-900"
          >
            <div className="text-sm text-stone-600 mb-1">Total Consultas</div>
            <div className="text-3xl font-bold text-amber-900">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600"
          >
            <div className="text-sm text-stone-600 mb-1">Nuevas</div>
            <div className="text-3xl font-bold text-green-600">{stats.newCount}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500"
          >
            <div className="text-sm text-stone-600 mb-1">Contactadas</div>
            <div className="text-3xl font-bold text-amber-600">{stats.contacted}</div>
          </motion.div>
        </div>

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="bg-white border border-stone-200 w-full justify-start p-2 h-auto flex-wrap gap-2">
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white px-4 py-2">
              <MessageSquare size={16} className="mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white px-4 py-2">
              <Package size={16} className="mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="therapies" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white px-4 py-2">
              <Heart size={16} className="mr-2" />
              Terapias
            </TabsTrigger>
            <TabsTrigger value="experiences" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white px-4 py-2">
              <Sparkles size={16} className="mr-2" />
              Experiencias
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white px-4 py-2">
              <ImageIcon size={16} className="mr-2" />
              Galería
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-amber-900">Consultas Recibidas</h2>
            </div>
            {loading ? (
               <div className="flex justify-center py-12 bg-white rounded-lg shadow">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
               </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-stone-600">No hay consultas aún</p>
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

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="therapies">
            <TherapyManager />
          </TabsContent>

          <TabsContent value="experiences">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;