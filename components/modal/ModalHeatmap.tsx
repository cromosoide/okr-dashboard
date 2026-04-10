'use client';

import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaHeatmap, WeekEntry } from '@/lib/types';

const EMOJIS = [
  { rating: 1, emoji: '😤', label: 'Mal' },
  { rating: 2, emoji: '😐', label: 'Meh' },
  { rating: 3, emoji: '💪', label: 'Bien' },
  { rating: 4, emoji: '🔥', label: 'Genial' },
  { rating: 5, emoji: '⭐', label: 'Top' },
];

function getWeekRange(weekIdx: number): string {
  const yearStart = new Date(2026, 0, 1);
  const start = new Date(yearStart.getTime() + weekIdx * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleDateString('es-MX', { month: 'short' })}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

function getCurrentWeek(): number {
  const yearStart = new Date(2026, 0, 1);
  return Math.min(51, Math.floor((Date.now() - yearStart.getTime()) / (7 * 24 * 60 * 60 * 1000)));
}

function getStreak(weeks: (WeekEntry | null)[]): number {
  const current = getCurrentWeek();
  let streak = 0;
  for (let i = current; i >= 0; i--) {
    if (weeks[i]) streak++;
    else break;
  }
  return streak;
}

function getRatingColor(rating: number): string {
  const colors = ['', '#fee2e2', '#fef9c3', '#dcfce7', '#bbf7d0', '#86efac'];
  return colors[rating] || '#f5f5f7';
}

export default function ModalHeatmap({ metaIdx, meta }: { metaIdx: number; meta: MetaHeatmap }) {
  const { rateWeek, noteWeek } = useDashboardContext();
  const reviewed = meta.weeks.filter(w => w !== null).length;
  const streak = getStreak(meta.weeks);
  const currentWeek = getCurrentWeek();
  const currentEntry = meta.weeks[currentWeek];

  const reviewedWeeks = meta.weeks
    .map((w, i) => ({ entry: w, idx: i }))
    .filter(({ entry, idx }) => entry !== null && idx !== currentWeek)
    .reverse();

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <span className="section-label" style={{ margin: 0 }}>Review Semanal</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {streak > 0 && (
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#f59e0b',
              background: '#fef3c7', padding: '4px 10px', borderRadius: 'var(--radius-pill)'
            }}>
              🔥 {streak}
            </span>
          )}
          <span style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
            background: 'var(--bg-light)', padding: '4px 10px', borderRadius: 'var(--radius-pill)'
          }}>
            {reviewed}/52
          </span>
        </div>
      </div>

      {/* Current week card */}
      <div style={{
        background: 'var(--bg-light)', border: '2px solid var(--blue-main)',
        borderRadius: 'var(--radius-card)', padding: 16, marginBottom: 20
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
          Semana {currentWeek + 1}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          {getWeekRange(currentWeek)}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          ¿Cómo estuvo tu semana?
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {EMOJIS.map(({ rating, emoji }) => (
            <button
              key={rating}
              onClick={() => rateWeek(metaIdx, currentWeek, rating)}
              style={{
                flex: 1, padding: '10px 0', fontSize: 22, cursor: 'pointer',
                background: currentEntry?.rating === rating ? getRatingColor(rating) : 'var(--bg-card)',
                border: currentEntry?.rating === rating ? '2px solid var(--blue-main)' : 'var(--border-thin)',
                borderRadius: 8, transition: 'all 0.15s ease-out'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Nota breve (opcional)..."
          defaultValue={currentEntry?.note ?? ''}
          onBlur={e => {
            if (currentEntry) noteWeek(metaIdx, currentWeek, e.target.value);
          }}
          style={{
            width: '100%', padding: 10, fontSize: 13,
            border: 'var(--border-thin)', borderRadius: 6,
            background: 'var(--bg-card)', outline: 'none'
          }}
        />
      </div>

      {/* History */}
      {reviewedWeeks.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Historial
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {reviewedWeeks.map(({ entry, idx }) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                background: getRatingColor(entry!.rating),
                fontSize: 13
              }}>
                <span style={{ fontSize: 16 }}>{EMOJIS[entry!.rating - 1]?.emoji}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, minWidth: 80 }}>
                  S{idx + 1} · {getWeekRange(idx).split(' - ')[0]}
                </span>
                {entry!.note && (
                  <span style={{ color: 'var(--text-main)', fontSize: 12, flex: 1 }}>
                    {entry!.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini heatmap */}
      <div style={{ marginTop: 20, padding: 12, background: 'var(--bg-light)', borderRadius: 'var(--radius-card)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
          Vista anual
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 2 }}>
          {meta.weeks.map((w, i) => (
            <div
              key={i}
              title={`S${i + 1}: ${w ? EMOJIS[w.rating - 1]?.label : 'Sin revisar'}`}
              style={{
                aspectRatio: '1',
                borderRadius: 2,
                background: w ? getRatingColor(w.rating) : 'var(--bg-body)',
                border: i === currentWeek ? '1px solid var(--blue-main)' : 'none',
                opacity: w ? 1 : 0.4
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
