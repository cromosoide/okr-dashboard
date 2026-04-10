'use client';

import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaFunnel } from '@/lib/types';
import ModalOKRList from './ModalOKRList';

export default function ModalFunnel({ metaIdx, meta }: { metaIdx: number; meta: MetaFunnel }) {
  const { updateFunnel } = useDashboardContext();

  return (
    <>
      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <span className="section-label" style={{ margin: 0 }}>Métricas de Embudo</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: 4,
        background: 'var(--bg-light)', color: 'var(--text-muted)', padding: '8px 10px',
        fontWeight: 600, textAlign: 'center', fontSize: 11,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        borderRadius: 8, marginBottom: 4,
      }}>
        <div>Mes</div><div>Inversión $</div><div>Leads</div><div>CPL</div>
      </div>

      {meta.funnelData.map((data, idx) => {
        const cpl = data.leads > 0 ? (data.spend / data.leads).toFixed(2) : '0.00';
        return (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: 4,
            borderBottom: 'var(--border-thin)', padding: '8px 0',
            alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-muted)' }}>{data.month}</div>
            <div>
              <input type="number" defaultValue={data.spend}
                onChange={e => updateFunnel(metaIdx, idx, 'spend', parseFloat(e.target.value) || 0)}
                style={{
                  width: '90%', padding: 6, border: 'var(--border-thin)',
                  borderRadius: 4, textAlign: 'center', fontSize: 13,
                  background: 'var(--bg-light)',
                }} />
            </div>
            <div>
              <input type="number" defaultValue={data.leads}
                onChange={e => updateFunnel(metaIdx, idx, 'leads', parseFloat(e.target.value) || 0)}
                style={{
                  width: '90%', padding: 6, border: 'var(--border-thin)',
                  borderRadius: 4, textAlign: 'center', fontSize: 13,
                  background: 'var(--bg-light)',
                }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: parseFloat(cpl) > 0 ? 'var(--rose-main)' : 'var(--text-muted)' }}>
              ${cpl}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
        <ModalOKRList metaIdx={metaIdx} okrs={meta.okrs} />
      </div>
    </>
  );
}
