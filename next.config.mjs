/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Las imágenes de productos/terapias/galería viven en Supabase Storage.
  // Hoy se renderizan con <img> plano (ver deuda en docs/MIGRACION-NEXT.md);
  // esto queda listo para cuando se migren a next/image.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
