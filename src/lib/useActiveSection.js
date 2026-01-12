// C:\Projects\Matukana\src\lib\useActiveSection.js
import { useEffect, useMemo, useState } from "react";

export function useActiveSection(sectionIds = []) {
  const stableKey = useMemo(() => sectionIds.filter(Boolean).join("|"), [sectionIds]);
  const [activeId, setActiveId] = useState(() => sectionIds[0] || "inicio");

  useEffect(() => {
    const ids = sectionIds.filter(Boolean);
    if (!ids.length) return;

    const getElements = () =>
      ids.map((id) => document.getElementById(id)).filter(Boolean);

    const elements = getElements();
    if (!elements.length) return;

    // --- Helper: elige la sección cuyo CENTRO esté más cerca del centro del viewport ---
    const pickByViewportCenter = () => {
      const viewportCenterY = window.innerHeight / 2;

      let bestId = activeId;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // si está totalmente fuera de pantalla, saltear
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

        const elCenterY = rect.top + rect.height / 2;
        const score = Math.abs(elCenterY - viewportCenterY);

        if (score < bestScore) {
          bestScore = score;
          bestId = el.id;
        }
      }

      if (bestId && bestId !== activeId) setActiveId(bestId);
    };

    // --- Set inicial: por si se carga con scroll o hash ---
    // (1) si viene con hash tipo #productos y existe, lo tomamos
    const hashId = (window.location.hash || "").replace("#", "");
    if (hashId && ids.includes(hashId)) {
      setActiveId(hashId);
    } else {
      pickByViewportCenter();
    }

    // --- Si no existe IntersectionObserver, fallback por scroll ---
    if (typeof IntersectionObserver === "undefined") {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          pickByViewportCenter();
          ticking = false;
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    // --- IntersectionObserver (con margen para “centro de pantalla”) ---
    const observer = new IntersectionObserver(
      () => {
        // En vez de confiar en entries (pueden venir “raros”),
        // recalculamos por centro de viewport -> más estable
        pickByViewportCenter();
      },
      {
        root: null,
        // cuando el “centro” de pantalla cae dentro de una sección, se considera candidata
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));

    // también reaccionar si cambian hashes por navegación del header
    const onHashChange = () => {
      const h = (window.location.hash || "").replace("#", "");
      if (h && ids.includes(h)) setActiveId(h);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey]); // stableKey representa el set de secciones actual

  return activeId;
}
