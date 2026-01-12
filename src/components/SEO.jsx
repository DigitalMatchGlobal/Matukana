// src/components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const SITE = {
  name: "Matukana",
  domain: "https://vivematukana.com",
  defaultOg: "/og-image.png",
  twitterCard: "summary_large_image",
};

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = "/",
  ogImage,
  type = "website",
  noindex = false,
  schema, // objeto o array JSON-LD
}) {
  // Evita duplicar "Matukana | ... | Matukana"
  const cleanTitle = (title || "").trim();
  const alreadyHasBrand = cleanTitle.toLowerCase().includes(SITE.name.toLowerCase());
  const fullTitle = cleanTitle
    ? alreadyHasBrand
      ? cleanTitle
      : `${cleanTitle} | ${SITE.name}`
    : SITE.name;

  const canonicalUrl =
    canonicalPath.startsWith("http")
      ? canonicalPath
      : `${SITE.domain}${canonicalPath}`;

  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE.domain}${ogImage}`
    : `${SITE.domain}${SITE.defaultOg}`;

  const robots = noindex ? "noindex,nofollow" : "index,follow";

  // Soporta schema objeto o array (graph)
  const jsonLd =
    Array.isArray(schema)
      ? { "@context": "https://schema.org", "@graph": schema }
      : schema || null;

  return (
    <Helmet>
      {/* Básico */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content={SITE.twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
