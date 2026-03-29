'use client';

import { useState, useRef, useEffect } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import type { InboxItem } from '@/lib/types';

const CATEGORIES = [
  { key: 'idea' as const, label: '\uD83D\uDCA1 Ideas', color: '#3b82f6' },
  { key: 'diseno' as const, label: '\uD83C\uDFA8 Dise\u00F1o', color: '#e11d48' },
  { key: 'ia' as const, label: '\uD83E\uDD16 IA', color: '#8b5cf6' },
  { key: 'purgatorio' as const, label: '\u2753 Otros', color: '#6B7280' },
];

export default function InboxPanel() {
  const { state, addInboxItem, deleteInboxItem } = useDashboardContext();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
        <div className="modal-header" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Captura Rápida</h3>
          </div>
          <button
            className="btn-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 16, flexGrow: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--bg-body)' }}>
          <div style={{ marginBottom: 20 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe una idea..."
              style={{
                width: '100%', padding: 10, border: '1px solid var(--border-color)',
                borderRadius: 8, fontSize: 14, marginBottom: 10, background: 'var(--bg-card)'
              }}
            />
            <div className="grid grid-2" style={{ gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className="btn-inbox"
                  style={{ background: cat.color }}
                  onClick={() => handleAdd(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.key} style={{
                background: 'var(--bg-card)', padding: 12,
                border: '1px solid var(--border-color)', borderRadius: 8
              }}>
                <h4 style={{
                  fontSize: 11, color: cat.color, marginBottom: 8, fontWeight: 600,
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
                        style={{ padding: '2px 6px', fontSize: 11 }}
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
