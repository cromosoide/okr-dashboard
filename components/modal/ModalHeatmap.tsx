'use client';

import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaHeatmap } from '@/lib/types';

export default function ModalHeatmap({ metaIdx, meta }: { metaIdx: number; meta: MetaHeatmap }) {
  const { toggleWeek } = useDashboardContext();
  const completed = meta.weeks.filter(Boolean).length;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>Racha de Auditor\u00EDas (52 Semanas)</span>
        <span style={{ fontSize: 12, fontWeight: 'bold', background: 'var(--bg-light)', padding: '4px 8px' }}>
          {completed}/52
        </span>
      </div>

      <div style={{
        border: '3px solid var(--border-color)', padding: 15,
        marginTop: 15, background: 'var(--bg-card)'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)',
          gap: 8, marginTop: 15
        }}>
          {meta.weeks.map((isDone, i) => (
            <div
              key={i}
              onClick={() => toggleWeek(metaIdx, i)}
              title={`Semana ${i + 1}`}
              style={{
                aspectRatio: '1', cursor: 'pointer',
                background: isDone ? 'var(--emerald-main)' : 'var(--bg-light)',
                border: `2px solid ${isDone ? 'var(--border-color)' : '#CCC'}`,
                transition: 'all 0.1s linear'
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
