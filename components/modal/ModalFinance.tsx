'use client';

import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaFinanceSum } from '@/lib/types';

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function ModalFinance({ metaIdx, meta }: { metaIdx: number; meta: MetaFinanceSum }) {
  const { updateFinanceFlow } = useDashboardContext();
  const currentTotal = meta.monthlyFlow.reduce((a, b) => a + b, 0);
  const pct = meta.target > 0 ? Math.min(100, Math.round((currentTotal / meta.target) * 100)) : 0;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>Flujo de Efectivo Mensual</span>
        <span style={{ fontSize: 12, fontWeight: 'bold', background: 'var(--bg-light)', padding: '4px 8px' }}>
          {pct}%
        </span>
      </div>
      <div className="input-grid grid grid-4" style={{ marginTop: 15 }}>
        {meta.monthlyFlow.map((val, i) => (
          <div key={i} className="input-group">
            <label>{MONTHS[i]} FLUJO</label>
            <input
              type="number"
              defaultValue={val}
              onChange={e => updateFinanceFlow(metaIdx, i, e.target.value === '' ? 0 : parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 15, fontWeight: 'bold', textAlign: 'right', color: 'var(--emerald-main)' }}>
        Total: ${currentTotal.toLocaleString()} / ${meta.target.toLocaleString()}
      </div>
    </>
  );
}
