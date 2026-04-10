'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaHealthScore } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  green: '#059669',
  yellow: '#f59e0b',
  red: '#ef4444',
};

export default function ModalHealthScore({ metaIdx, meta }: { metaIdx: number; meta: MetaHealthScore }) {
  const { updateClientStatus, updateClientName, addClient } = useDashboardContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const name = inputRef.current?.value.trim();
    if (!name) return;
    addClient(metaIdx, name);
    if (inputRef.current) inputRef.current.value = '';
  };

  const greens = meta.clients.filter(c => c.status === 'green').length;

  return (
    <>
      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <span className="section-label" style={{ margin: 0 }}>Semáforo de Retención</span>
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
          background: 'var(--bg-light)', padding: '4px 10px', borderRadius: 'var(--radius-pill)',
        }}>
          {greens}/{meta.clients.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {meta.clients.map((client, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: 'var(--border-thin)', borderRadius: 'var(--radius-card)',
            padding: 12, background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-flat)',
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: STATUS_COLORS[client.status],
            }} />
            <strong
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateClientName(metaIdx, idx, e.currentTarget.innerText)}
              style={{
                fontSize: 14, outline: 'none', flexGrow: 1,
                cursor: 'text',
              }}
              dangerouslySetInnerHTML={{ __html: client.name }}
            />
            <select
              value={client.status}
              onChange={e => updateClientStatus(metaIdx, idx, e.target.value as 'green' | 'yellow' | 'red')}
              style={{
                padding: '6px 8px', border: 'var(--border-thin)', borderRadius: 6,
                fontWeight: 500, fontSize: 12, background: 'var(--bg-light)',
                color: 'var(--text-main)', cursor: 'pointer',
              }}
            >
              <option value="green">Óptimo</option>
              <option value="yellow">Riesgo</option>
              <option value="red">Crítico</option>
            </select>
          </div>
        ))}

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input ref={inputRef} type="text" placeholder="Nuevo cliente..."
            style={{
              flex: 1, padding: 10, border: 'var(--border-thin)', borderRadius: 6,
              fontSize: 13, background: 'var(--bg-light)', outline: 'none',
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button onClick={handleAdd}
            style={{
              padding: '10px 14px', fontSize: 12, fontWeight: 500,
              background: 'var(--blue-main)', color: 'white',
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}>
            Añadir
          </button>
        </div>
      </div>
    </>
  );
}
