import { useEffect, useState } from "react";

export function useActiveSection(sectionIds = []) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "inicio");

  useEffect(() => {
    if (!sectionIds.length) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // nos quedamos con el entry más visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        // Ajuste fino: cuando el “centro” de pantalla cae en una sección, la considera activa
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-35% 0px -55% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds.join("|")]);

  return activeId;
}
