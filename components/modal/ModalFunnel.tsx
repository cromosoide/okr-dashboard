'use client';

import { useDashboardContext } from '@/contexts/DashboardContext';
import type { MetaFunnel } from '@/lib/types';
import ModalOKRList from './ModalOKRList';

export default function ModalFunnel({ metaIdx, meta }: { metaIdx: number; meta: MetaFunnel }) {
  const { updateFunnel } = useDashboardContext();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="section-label" style={{ margin: 0 }}>M\u00E9tricas de Embudo y Tareas</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: 5,
        background: 'var(--bg-dark)', color: 'var(--text-white)', padding: 10,
        fontWeight: 'bold', textAlign: 'center', marginTop: 15
      }}>
        <div>Mes</div><div>Inversi\u00F3n $</div><div>Leads</div><div>CPL</div>
      </div>

      {meta.funnelData.map((data, idx) => {
        const cpl = data.leads > 0 ? (data.spend / data.leads).toFixed(2) : '0.00';
        return (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: 5,
            borderBottom: '1px solid var(--border-color)', padding: '5px 0',
            alignItems: 'center', textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold' }}>{data.month}</div>
            <div>
              <input type="number" defaultValue={data.spend}
                onChange={e => updateFunnel(metaIdx, idx, 'spend', parseFloat(e.target.value) || 0)}
                style={{ width: '90%', padding: 5, border: '1px solid var(--border-color)', textAlign: 'center' }} />
            </div>
            <div>
              <input type="number" defaultValue={data.leads}
                onChange={e => updateFunnel(metaIdx, idx, 'leads', parseFloat(e.target.value) || 0)}
                style={{ width: '90%', padding: 5, border: '1px solid var(--border-color)', textAlign: 'center' }} />
            </div>
            <div style={{ fontWeight: 900, color: parseFloat(cpl) > 0 ? 'var(--rose-main)' : 'var(--text-main)' }}>
              ${cpl}
            </div>
          </div>
        );
      })}

      <h4 style={{ marginTop: 24, marginBottom: 12, borderBottom: '2px solid var(--border-color)', paddingBottom: 8 }}>
        Tareas y Diseño:
      </h4>

      <ModalOKRList metaIdx={metaIdx} okrs={meta.okrs} />
    </>
  );
}
