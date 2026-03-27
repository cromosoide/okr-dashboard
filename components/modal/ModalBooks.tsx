'use client';

import { useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaBooksList } from '@/lib/types';

export default function ModalBooks({ metaIdx, meta }: { metaIdx: number; meta: MetaBooksList }) {
  const { addBook, deleteBook } = useDashboardContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    addBook(metaIdx, text);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>Biblioteca de Alto Rendimiento</span>
        <span style={{ fontSize: 12, fontWeight: 'bold', background: 'var(--bg-light)', padding: '4px 8px' }}>
          {meta.books.length} / {meta.target}
        </span>
      </div>

      <div className="add-okr-row" style={{ marginBottom: 15, marginTop: 0 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="T\u00EDtulo..."
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button onClick={handleAdd}>Añadir</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {meta.books.map((book, index) => (
          <li key={index} style={{
            display: 'flex', justifyContent: 'space-between', padding: 8,
            border: '1px solid var(--border-color)', marginBottom: 8, alignItems: 'center'
          }}>
            <span>{book}</span>
            <button
              className="btn-delete"
              style={{ padding: '2px 8px' }}
              onClick={() => { if (confirm('\u00BFEliminar este libro?')) deleteBook(metaIdx, index); }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
