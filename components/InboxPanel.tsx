'use client';

import { useState, useRef } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { InboxItem } from '@/lib/types';

const CATEGORIES = [
  { key: 'idea' as const, label: '\uD83D\uDCA1 Mis Ideas', color: '#3b82f6' },
  { key: 'diseno' as const, label: '\uD83C\uDFA8 Dise\u00F1o/MKT', color: '#e11d48' },
  { key: 'ia' as const, label: '\uD83E\uDD16 IA', color: '#8b5cf6' },
  { key: 'purgatorio' as const, label: '\u2753 Purgatorio', color: '#64748b' },
];

export default function InboxPanel() {
  const { state, addInboxItem, deleteInboxItem } = useDashboardContext();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (category: InboxItem['category']) => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    addInboxItem(category, text);
    if (inputRef.current) inputRef.current.value = '';
  };

  const itemsByCategory = (cat: InboxItem['category']) =>
    state.inbox.filter(i => i.category === cat);

  return (
    <>
      <button className="fab-btn" onClick={() => setIsOpen(!isOpen)}>📥</button>

      <aside className={`inbox-panel ${isOpen ? 'active' : ''}`}>
        <div className="modal-header" style={{ background: 'var(--bg-dark)', color: 'white', borderBottom: 'none' }}>
          <div>
            <h3 style={{ color: 'white', fontSize: 20 }}>Matriz de Cuarentena</h3>
          </div>
          <button
            className="btn-close"
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 24, flexGrow: 1, overflowY: 'auto', background: 'var(--bg-body)' }}>
          <div style={{ marginBottom: 24 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Captura rápida..."
              style={{
                width: '100%', padding: 12, border: '1px solid var(--border-color)',
                fontSize: 14, marginBottom: 12
              }}
            />
            <div className="grid grid-2" style={{ gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className="btn-cmd"
                  style={{ background: cat.color }}
                  onClick={() => handleAdd(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.key} style={{
                background: 'var(--bg-card)', padding: 16,
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{
                  fontSize: 13, color: cat.color, marginBottom: 12,
                  borderBottom: '1px solid var(--border-color)', paddingBottom: 4
                }}>
                  {cat.label}
                </h4>
                <div>
                  {itemsByCategory(cat.key).map(item => (
                    <div key={item.id} className="inbox-item">
                      <span>{item.text}</span>
                      <button
                        className="btn-delete"
                        style={{ padding: '2px 8px', fontSize: 12 }}
                        onClick={() => deleteInboxItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
