// Textos de SEO por sección, rescatados del App.jsx de la versión Vite, donde
// el <title> cambiaba al scrollear (ver docs/MIGRACION-NEXT.md, decisión 1).
//
// Hoy NO se usan: el metadata se resuelve en el server. Quedan acá porque son
// buenos textos y entran tal cual el día que cada sección sea una ruta propia
// (/terapias, /productos, …), que es cuando este SEO empieza a valer.

export const seoBySection = {
  inicio: {
    title: 'Matukana | Bienestar, masajes y terapias holísticas en Salta',
    description:
      'Masajes terapéuticos, terapias holísticas y medicina natural en el centro de Salta. Lunes a viernes de 12 a 20 hs. Turnos por WhatsApp.',
  },
  'sobre-agustin': {
    title: 'Sobre Agustín | Matukana',
    description:
      'Conocé la historia de Matukana y el recorrido de Agustín: territorio, plantas medicinales, terapias y bienestar integral en Salta.',
  },
  productos: {
    title: 'Productos naturales | Matukana (Salta)',
    description:
      'Aceites, ungüentos y preparados artesanales basados en plantas medicinales. Consultas y pedidos por WhatsApp desde Salta.',
  },
  terapias: {
    title: 'Masajes terapéuticos en Salta | Matukana',
    description:
      'Masajes terapéuticos y abordajes holísticos en el centro de Salta. Acompañamiento personalizado para bienestar físico y equilibrio.',
  },
  experiencias: {
    title: 'Experiencias en la naturaleza | Matukana (Salta)',
    description:
      'Caminatas, sahumos y experiencias conscientes en la naturaleza. Conexión con el territorio y bienestar integral desde Salta.',
  },
  galeria: {
    title: 'Galería | Matukana',
    description:
      'Imágenes de Matukana: terapias, productos y experiencias. Naturaleza, territorio y bienestar en Salta.',
  },
  contacto: {
    title: 'Contacto | Matukana (Salta) | Turnos por WhatsApp',
    description:
      'Ubicación: Ameghino 653 (Hotel Inkai, 2° piso), Salta. Lunes a viernes 12 a 20 hs. WhatsApp +54 9 3874 83-3177. Instagram @vive.matukana.',
  },
};
