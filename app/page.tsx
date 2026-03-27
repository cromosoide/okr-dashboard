'use client';

import { useState, useEffect } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import Header from '@/components/Header';
import PilarSection from '@/components/PilarSection';
import MetaModal from '@/components/MetaModal';
import InboxPanel from '@/components/InboxPanel';

const PILARS = [
  { pilar: 1 as const, title: '\uD83D\uDFE5 PILAR 1: FUNDAMENTO (La Base)', colorClass: 'title-rose', gridClass: 'grid grid-1 md-grid-2 lg-grid-3' },
  { pilar: 2 as const, title: '\uD83D\uDFE6 PILAR 2: CRECIMIENTO (Academia y Hogar)', colorClass: 'title-blue', gridClass: 'grid grid-1 md-grid-2 lg-grid-4' },
  { pilar: 3 as const, title: '\uD83D\uDFE9 PILAR 3: COSECHA (Expansi\u00F3n)', colorClass: 'title-emerald', gridClass: 'grid grid-1 lg-grid-3' },
];

export default function DashboardPage() {
  const { state, saveNotes, factoryReset } = useDashboardContext();
  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);

  // Lock body scroll when modal is open (prevents iOS scroll trap)
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
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [activeModalIdx]);

  const metasByPilar = (pilar: 1 | 2 | 3) =>
    state.metas
      .map((meta, idx) => ({ meta, idx }))
      .filter(({ meta }) => meta.pilar === pilar);

  return (
    <>
      <Header />

      <main className="container section-mt">
        {PILARS.map(p => (
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
          <h2 className="section-title">📝 NOTAS Y FECHAS</h2>
          <textarea
            defaultValue={state.notes}
            onBlur={e => saveNotes(e.target.value)}
            placeholder="Bitácora de mantenimiento (Ej. Compra del boiler: 15 Mar 2026)..."
            style={{
              width: '100%', minHeight: 150, fontSize: '1.1rem',
              border: 'var(--border-thick)', background: 'var(--bg-card)',
              color: 'var(--text-main)', padding: 16, outline: 'none',
              boxShadow: 'var(--shadow-flat)', resize: 'vertical', fontFamily: 'inherit'
            }}
          />
        </section>

        <div className="text-center mt-12" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 32 }}>
          <a className="reset-link" onClick={factoryReset}>
            Hard Reset (Borrar Base de Datos Local)
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
