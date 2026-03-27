'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaHealthScore } from '@/lib/types';

export default function ModalHealthScore({ metaIdx, meta }: { metaIdx: number; meta: MetaHealthScore }) {
  const { updateClientStatus, updateClientName, addClient } = useDashboardContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const name = inputRef.current?.value.trim();
    if (!name) return;
    addClient(metaIdx, name);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>Semáforo de Retención</span>
        <span style={{ fontSize: 12, fontWeight: 'bold', background: 'var(--bg-light)', padding: '4px 8px' }}>
          CLIENTES
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 15 }}>
        {meta.clients.map((client, idx) => {
          const bg = client.status === 'green' ? 'var(--emerald-main)' : client.status === 'yellow' ? '#f59e0b' : 'var(--rose-main)';
          const color = client.status === 'yellow' ? '#000' : '#FFF';
          return (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '2px solid var(--border-color)', padding: 12, background: 'var(--bg-card)'
            }}>
              <strong
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateClientName(metaIdx, idx, e.currentTarget.innerText)}
                style={{
                  fontSize: 14, outline: 'none', borderBottom: '1px dashed var(--text-muted)',
                  cursor: 'text', flexGrow: 1, marginRight: 16
                }}
                dangerouslySetInnerHTML={{ __html: client.name }}
              />
              <select
                value={client.status}
                onChange={e => updateClientStatus(metaIdx, idx, e.target.value as 'green' | 'yellow' | 'red')}
                style={{
                  padding: 6, border: '2px solid var(--border-color)',
                  fontWeight: 'bold', background: bg, color, cursor: 'pointer'
                }}
              >
                <option value="green">Óptimo</option>
                <option value="yellow">Riesgo</option>
                <option value="red">Crítico</option>
              </select>
            </div>
          );
        })}

        <div style={{ marginTop: 15, display: 'flex', gap: 8 }}>
          <input ref={inputRef} type="text" placeholder="Nombre del nuevo cliente..."
            style={{ flex: 1, padding: 8, border: '2px solid var(--border-color)' }}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button className="btn-cmd" onClick={handleAdd}
            style={{ padding: '8px 16px', width: 'auto', fontSize: 14 }}>
            Añadir Cliente
          </button>
        </div>
      </div>
    </>
  );
}
