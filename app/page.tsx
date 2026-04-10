'use client';

import { useState, useEffect } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import Header from '@/components/Header';
import PilarSection from '@/components/PilarSection';
import MetaModal from '@/components/MetaModal';
import InboxPanel from '@/components/InboxPanel';

const PILARS = [
  { pilar: 1 as const, title: 'Fundamento', colorClass: 'title-rose', gridClass: 'grid grid-1 md-grid-2 lg-grid-3' },
  { pilar: 2 as const, title: 'Crecimiento', colorClass: 'title-blue', gridClass: 'grid grid-1 md-grid-2 lg-grid-4' },
  { pilar: 3 as const, title: 'Cosecha', colorClass: 'title-emerald', gridClass: 'grid grid-1 lg-grid-3' },
];

const PILAR_COLORS = { 1: 'rose', 2: 'blue', 3: 'emerald' } as const;

export default function DashboardPage() {
  const { state, saveNotes, factoryReset } = useDashboardContext();
  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);
  const [activePilar, setActivePilar] = useState<1 | 2 | 3>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalIdx !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, Math.abs(parseInt(scrollY || '0', 10)));
    }
  }, [activeModalIdx]);

  const metasByPilar = (pilar: 1 | 2 | 3) =>
    state.metas
      .map((meta, idx) => ({ meta, idx }))
      .filter(({ meta }) => meta.pilar === pilar);

  const visiblePilars = PILARS.filter(p => isMobile ? p.pilar === activePilar : true);

  return (
    <>
      <Header />

      <nav className="pilar-tabs container">
        {PILARS.map(p => (
          <button
            key={p.pilar}
            className={`pilar-tab ${activePilar === p.pilar ? `active active-${PILAR_COLORS[p.pilar]}` : ''}`}
            onClick={() => setActivePilar(p.pilar)}
          >
            {p.title}
          </button>
        ))}
      </nav>

      <main className="container">
        {visiblePilars.map(p => (
          <PilarSection
            key={p.pilar}
            pilar={p.pilar}
            title={p.title}
            colorClass={p.colorClass}
            gridClass={p.gridClass}
            metas={metasByPilar(p.pilar)}
            onOpenModal={setActiveModalIdx}
          />
        ))}

        <section className="section-mt">
          <h2 className="section-title">Notas</h2>
          <textarea
            defaultValue={state.notes}
            onBlur={e => saveNotes(e.target.value)}
            placeholder="Bitácora de mantenimiento..."
            style={{
              width: '100%', minHeight: 120, fontSize: '0.9rem',
              border: '1px solid var(--border-color)', background: 'var(--bg-light)',
              color: 'var(--text-main)', padding: 12, outline: 'none',
              borderRadius: 8, resize: 'vertical', fontFamily: 'inherit'
            }}
          />
        </section>

        <div className="text-center mt-12" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
          <a className="reset-link" onClick={factoryReset}>
            Reset (Borrar Base de Datos)
          </a>
        </div>
      </main>

      {activeModalIdx !== null && (
        <MetaModal metaIdx={activeModalIdx} onClose={() => setActiveModalIdx(null)} />
      )}

      <InboxPanel />
    </>
  );
}
