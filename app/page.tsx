'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { Achievement } from '@/lib/types';
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

function AchievementsSection({ achievements, onAdd, onDelete }: {
  achievements: Achievement[];
  onAdd: (text: string) => void;
  onDelete: (id: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentQ = Math.floor(new Date().getMonth() / 3) + 1;
  const currentQAchievements = achievements.filter(a => a.quarter === currentQ);
  const pastAchievements = achievements.filter(a => a.quarter !== currentQ);

  const handleAdd = useCallback(() => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    onAdd(text);
    if (inputRef.current) inputRef.current.value = '';
  }, [onAdd]);

  return (
    <section className="section-mt">
      <h2 className="section-title">Logros del Q{currentQ}</h2>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, marginTop: -8 }}>
        Victorias no planeadas que vale la pena recordar
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Registra un logro..."
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          style={{
            flex: 1, padding: 10, border: 'var(--border-thin)', borderRadius: 6,
            fontSize: 13, background: 'var(--bg-light)', outline: 'none',
          }}
        />
        <button onClick={handleAdd} style={{
          padding: '10px 14px', fontSize: 16, fontWeight: 500,
          background: 'var(--blue-main)', color: 'white',
          border: 'none', borderRadius: 6, cursor: 'pointer',
        }}>
          +
        </button>
      </div>

      {currentQAchievements.length === 0 && (
        <div style={{
          padding: 20, textAlign: 'center', color: 'var(--text-light)',
          fontSize: 13, background: 'var(--bg-light)', borderRadius: 'var(--radius-card)',
        }}>
          Sin logros registrados este quarter. Agrega el primero.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {currentQAchievements.map(a => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', background: '#ecfdf5', borderRadius: 8,
            border: '1px solid #d1fae5',
          }}>
            <span style={{ fontSize: 14 }}>🏆</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-main)' }}>
              {a.text}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {new Date(a.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
            </span>
            <button
              className="btn-delete"
              onClick={() => onDelete(a.id)}
              style={{ padding: '2px 6px', fontSize: 11 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {pastAchievements.length > 0 && (
        <details style={{ marginTop: 16 }}>
          <summary style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
            cursor: 'pointer', padding: '4px 0',
          }}>
            Quarters anteriores ({pastAchievements.length})
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {pastAchievements.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', background: 'var(--bg-light)', borderRadius: 6,
                fontSize: 12, color: 'var(--text-muted)',
              }}>
                <span>🏆</span>
                <span style={{ flex: 1 }}>{a.text}</span>
                <span style={{ fontSize: 10, whiteSpace: 'nowrap' }}>Q{a.quarter}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const { state, saveNotes, addAchievement, deleteAchievement, factoryReset } = useDashboardContext();
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
  const scrollYRef = useRef(0);
  useEffect(() => {
    if (activeModalIdx !== null) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollYRef.current}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollYRef.current);
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

        <AchievementsSection
          achievements={state.achievements ?? []}
          onAdd={addAchievement}
          onDelete={deleteAchievement}
        />

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
