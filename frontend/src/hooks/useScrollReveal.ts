'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeAll = () => {
      root.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el));
    };

    observeAll();

    // Re-observe elements added/changed later (e.g. when product filters switch).
    const mo = new MutationObserver(() => observeAll());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return ref;
}
