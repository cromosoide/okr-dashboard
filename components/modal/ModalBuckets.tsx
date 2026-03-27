'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaBuckets } from '@/lib/types';

export default function ModalBuckets({ metaIdx, meta }: { metaIdx: number; meta: MetaBuckets }) {
  const { updateBucket, updateBucketTarget, updateBucketName, deleteBucket, addBucket } = useDashboardContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const totalSaved = meta.buckets.reduce((a, b) => a + b.saved, 0);
  const totalTarget = meta.buckets.reduce((a, b) => a + b.target, 0);
  const pct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleAdd = () => {
    const name = nameRef.current?.value.trim();
    const target = parseFloat(targetRef.current?.value || '0');
    if (!name || target <= 0) return;
    addBucket(metaIdx, name, target);
    if (nameRef.current) nameRef.current.value = '';
    if (targetRef.current) targetRef.current.value = '';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>Fondos de Amortizaci\u00F3n (Buckets)</span>
        <span style={{ fontSize: 12, fontWeight: 'bold', background: 'var(--bg-light)', padding: '4px 8px' }}>
          {pct}%
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
        {meta.buckets.map((bucket, idx) => {
          const isDone = bucket.saved >= bucket.target;
          return (
            <div key={idx} style={{
              background: 'var(--bg-body)', border: '2px solid var(--border-color)',
              padding: 12, position: 'relative', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
            }}>
              <button
                className="btn-delete"
                onClick={() => { if (confirm('\u00BFEliminar bucket?')) deleteBucket(metaIdx, idx); }}
                style={{
                  position: 'absolute', top: -12, right: -12, width: 28, height: 28,
                  padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, zIndex: 10
                }}
                title="Eliminar Bucket"
              >
                ✕
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                <strong
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBucketName(metaIdx, idx, e.currentTarget.innerText)}
                  style={{
                    color: 'var(--text-main)', fontSize: 16, flexGrow: 1,
                    borderBottom: '2px dashed var(--border-color)', outline: 'none', paddingBottom: 2
                  }}
                  dangerouslySetInnerHTML={{ __html: bucket.name }}
                />
                {isDone && (
                  <span style={{
                    background: 'var(--emerald-main)', color: 'var(--bg-dark)',
                    border: '2px solid var(--border-color)', padding: '2px 8px',
                    fontWeight: 900, fontSize: 11, marginLeft: 12, textTransform: 'uppercase'
                  }}>
                    Listo ✔️
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>GUARDADO ($)</label>
                  <input
                    type="number"
                    defaultValue={bucket.saved}
                    onChange={e => updateBucket(metaIdx, idx, parseFloat(e.target.value) || 0)}
                    style={{ padding: 8, fontSize: '1.2rem' }}
                  />
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>META TARGET ($)</label>
                  <input
                    type="number"
                    defaultValue={bucket.target}
                    onChange={e => updateBucketTarget(metaIdx, idx, parseFloat(e.target.value) || 0)}
                    style={{ padding: 8, fontSize: '1.2rem' }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--border-color)',
          display: 'flex', gap: 8, alignItems: 'stretch'
        }}>
          <input ref={nameRef} type="text" placeholder="Nuevo bucket..."
            style={{ flex: 2, padding: 10, border: '2px solid var(--border-color)', outline: 'none', fontWeight: 'bold' }} />
          <input ref={targetRef} type="number" placeholder="Meta $"
            style={{ flex: 1, padding: 10, border: '2px solid var(--border-color)', outline: 'none', fontWeight: 'bold' }} />
          <button className="btn-cmd" onClick={handleAdd}
            style={{ flex: 1, padding: 10, fontSize: 12 }}>Añadir</button>
        </div>
      </div>
    </>
  );
}
