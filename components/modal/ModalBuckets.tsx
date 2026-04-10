'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaBuckets } from '@/lib/types';

export default function ModalBuckets({ metaIdx, meta }: { metaIdx: number; meta: MetaBuckets }) {
  const { updateBucket, updateBucketTarget, updateBucketName, deleteBucket, addBucket, toggleBucketDone } = useDashboardContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const totalSaved = meta.buckets.reduce((a, b) => a + b.saved, 0);
  const totalTarget = meta.buckets.reduce((a, b) => a + b.target, 0);
  const pct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const hasCategories = meta.buckets.some(b => b.category);
  const quickBuckets = meta.buckets.map((b, i) => ({ ...b, originalIdx: i })).filter(b => b.category === 'quick');
  const bigBuckets = meta.buckets.map((b, i) => ({ ...b, originalIdx: i })).filter(b => b.category === 'big');
  const uncategorized = meta.buckets.map((b, i) => ({ ...b, originalIdx: i })).filter(b => !b.category);

  const handleAdd = (category?: 'quick' | 'big') => {
    const name = nameRef.current?.value.trim();
    const target = parseFloat(targetRef.current?.value || '0');
    if (!name || target <= 0) return;
    addBucket(metaIdx, name, target, category);
    if (nameRef.current) nameRef.current.value = '';
    if (targetRef.current) targetRef.current.value = '';
  };

  const renderQuickBucket = (bucket: typeof meta.buckets[0] & { originalIdx: number }) => {
    const idx = bucket.originalIdx;
    const isDone = bucket.done === true;

    return (
      <div key={idx} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 0',
        borderBottom: 'var(--border-thin)',
        opacity: isDone ? 0.5 : 1,
      }}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={e => toggleBucketDone(metaIdx, idx, e.target.checked)}
          style={{
            width: 18, height: 18, cursor: 'pointer', flexShrink: 0,
            accentColor: 'var(--blue-main)',
          }}
        />
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={e => updateBucketName(metaIdx, idx, e.currentTarget.innerText)}
          style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            textDecoration: isDone ? 'line-through' : 'none',
            outline: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: bucket.name }}
        />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          ${bucket.target.toLocaleString()}
        </span>
        <button
          className="btn-delete"
          onClick={() => { if (confirm('¿Eliminar?')) deleteBucket(metaIdx, idx); }}
          style={{ padding: '2px 6px', fontSize: 11 }}
        >
          ✕
        </button>
      </div>
    );
  };

  const renderBigBucket = (bucket: typeof meta.buckets[0] & { originalIdx: number }) => {
    const idx = bucket.originalIdx;
    const isDone = bucket.done === true;
    const bucketPct = bucket.target > 0 ? Math.min(100, Math.round((bucket.saved / bucket.target) * 100)) : 0;

    return (
      <div key={idx} style={{
        background: 'var(--bg-light)',
        border: 'var(--border-thin)',
        borderRadius: 'var(--radius-card)',
        padding: 14,
        position: 'relative',
        boxShadow: 'var(--shadow-flat)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={isDone}
            onChange={e => toggleBucketDone(metaIdx, idx, e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', flexShrink: 0, accentColor: 'var(--blue-main)' }}
          />
          <strong
            contentEditable
            suppressContentEditableWarning
            onBlur={e => updateBucketName(metaIdx, idx, e.currentTarget.innerText)}
            style={{
              color: 'var(--text-main)', fontSize: 14, flexGrow: 1,
              borderBottom: '1px solid var(--border-color)', outline: 'none', paddingBottom: 2,
              textDecoration: isDone ? 'line-through' : 'none',
            }}
            dangerouslySetInnerHTML={{ __html: bucket.name }}
          />
          {isDone && (
            <span style={{
              background: '#ecfdf5', color: '#059669',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 10px', fontWeight: 500, fontSize: 11,
            }}>
              Listo ✔️
            </span>
          )}
          <button
            className="btn-delete"
            onClick={() => { if (confirm('¿Eliminar?')) deleteBucket(metaIdx, idx); }}
            style={{ padding: '2px 6px', fontSize: 11 }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-body)', marginBottom: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${bucketPct}%`,
            background: isDone ? '#059669' : 'var(--blue-main)',
            transition: 'width 0.3s ease-out',
          }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
            <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>GUARDADO ($)</label>
            <input type="number" defaultValue={bucket.saved}
              onChange={e => updateBucket(metaIdx, idx, parseFloat(e.target.value) || 0)}
              style={{ padding: 8, fontSize: '1rem' }} />
          </div>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
            <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>META ($)</label>
            <input type="number" defaultValue={bucket.target}
              onChange={e => updateBucketTarget(metaIdx, idx, parseFloat(e.target.value) || 0)}
              style={{ padding: 8, fontSize: '1rem' }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <span className="section-label" style={{ margin: 0 }}>Fondos de Amortización</span>
        <span style={{
          fontSize: 12, fontWeight: 600, color: pct >= 100 ? '#059669' : 'var(--text-muted)',
          background: 'var(--bg-light)', padding: '4px 10px', borderRadius: 'var(--radius-pill)',
        }}>
          {pct}%
        </span>
      </div>

      {hasCategories ? (
        <>
          {quickBuckets.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                📌 Pequeñas Mejoras
              </div>
              {quickBuckets.map(renderQuickBucket)}
            </div>
          )}
          {bigBuckets.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>
                🏗️ Grandes Proyectos
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bigBuckets.map(renderBigBucket)}
              </div>
            </div>
          )}
          {uncategorized.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {uncategorized.map(renderBigBucket)}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {meta.buckets.map((b, i) => renderBigBucket({ ...b, originalIdx: i }))}
        </div>
      )}

      <div style={{
        marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)',
        display: 'flex', gap: 8, alignItems: 'stretch',
      }}>
        <input ref={nameRef} type="text" placeholder="Nuevo..."
          style={{ flex: 2, padding: 10, border: 'var(--border-thin)', borderRadius: 6, outline: 'none', fontSize: 13 }} />
        <input ref={targetRef} type="number" placeholder="$"
          style={{ flex: 1, padding: 10, border: 'var(--border-thin)', borderRadius: 6, outline: 'none', fontSize: 13 }} />
        <button onClick={() => handleAdd(hasCategories ? 'quick' : undefined)}
          style={{
            padding: '10px 14px', fontSize: 12, fontWeight: 500,
            background: 'var(--blue-main)', color: 'white',
            border: 'none', borderRadius: 6, cursor: 'pointer',
          }}>
          +
        </button>
      </div>
    </>
  );
}
