import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name, type, image }) => {
  // Usamos tu imagen por defecto de la carpeta public
  const defaultImage = '/og-image.png'; 
  const siteUrl = 'https://tudominio.com'; // IMPORTANTE: Cambia esto por tu dominio real

  return (
    <Helmet>
      {/* Etiquetas estándar */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      
      {/* Etiquetas para Facebook / Open Graph */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={siteUrl} />
      
      {/* Etiquetas para Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical URL (Evita contenido duplicado) */}
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
}

export default SEO;