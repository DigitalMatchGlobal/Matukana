import React from "react";
import { Helmet } from "react-helmet-async";

function stripHash(url) {
  // saca #loquesea para canonical/og:url
  return (url || "").split("#")[0];
}

function absolutize(siteUrl, pathOrUrl) {
  if (!pathOrUrl) return siteUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const cleanBase = siteUrl.replace(/\/$/, "");
  const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${cleanBase}${cleanPath}`;
}

export default function SEO({
  title,
  description,
  keywords,
  ogType = "website",
  ogImage, // path "/og-image.png" o url absoluta
  noindex = false, // para admin/login
  schema, // objeto JSON-LD opcional
}) {
  // Dominio desde .env (Vite)
  const envSiteUrl = (import.meta?.env?.VITE_SITE_URL || "").trim();
  const siteUrl =
    envSiteUrl && /^https?:\/\//i.test(envSiteUrl)
      ? envSiteUrl
      : "https://www.vivematukana.com";

  // Canonical dinámico (SIN hash)
  const currentUrl =
    typeof window !== "undefined" ? stripHash(window.location.href) : siteUrl;

  // OG image absoluta
  const defaultImage = "/og-image.png";
  const imageAbs = absolutize(siteUrl, ogImage || defaultImage);

  const robots = noindex ? "noindex,nofollow" : "index,follow";

  return (
    <Helmet>
      {/* Básico */}
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Matukana" />
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageAbs} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={imageAbs} />

      {/* Schema.org JSON-LD */}
      {schema ? (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      ) : null}
    </Helmet>
  );
}
