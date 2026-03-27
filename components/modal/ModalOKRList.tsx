'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { OKR } from '@/lib/types';

interface Props {
  metaIdx: number;
  okrs: OKR[];
  showAddRow?: boolean;
}

export default function ModalOKRList({ metaIdx, okrs, showAddRow = true }: Props) {
  const { toggleOKR, editOKRText, addOKR, deleteOKR } = useDashboardContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const doneCount = okrs.filter(o => o.done).length;

  const handleAdd = () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    addOKR(metaIdx, text);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>OKRs Estratégicos y Tareas</span>
        <span style={{
          fontSize: 12, fontWeight: 'bold',
          background: doneCount === okrs.length && okrs.length > 0 ? 'var(--emerald-light, var(--bg-light))' : 'var(--bg-light)',
          padding: '4px 8px',
        }}>
          {doneCount} / {okrs.length}
        </span>
      </div>

      {okrs.map((okr, index) => (
        <label key={index} className="okr-item">
          <input
            type="checkbox"
            className="okr-checkbox"
            checked={okr.done}
            onChange={e => toggleOKR(metaIdx, index, e.target.checked)}
          />
          <div
            className="okr-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={e => editOKRText(metaIdx, index, e.currentTarget.innerText)}
            onClick={e => e.preventDefault()}
            dangerouslySetInnerHTML={{ __html: okr.text }}
          />
          <button
            className="btn-delete"
            onClick={e => { e.preventDefault(); if (confirm('\u00BFEliminar este OKR?')) deleteOKR(metaIdx, index); }}
          >
            ✕
          </button>
        </label>
      ))}

      {showAddRow && (
        <div className="add-okr-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Agregar nuevo OKR o micro-tarea..."
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button onClick={handleAdd}>+</button>
        </div>
      )}
    </>
  );
}
