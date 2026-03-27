'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import type { Meta } from '@/lib/types';
import { getPilarColor } from '@/lib/types';
import { getMetaProgress } from '@/lib/getMetaProgress';
import { useDashboardContext } from '@/contexts/DashboardContext';

const ChartWidget = dynamic(() => import('./ChartWidget'), { ssr: false });

interface Props {
  meta: Meta;
  metaIdx: number;
  onOpenModal: (idx: number) => void;
}

function MetaCardInner({ meta, metaIdx, onOpenModal }: Props) {
  const { updateText } = useDashboardContext();
  const color = getPilarColor(meta.pilar);
  const progress = getMetaProgress(meta);
  const colSpanClass = (meta.type === 'chart_line' && meta.pilar !== 2) ? 'lg-col-span-2' : '';

  const renderProgress = () => {
    let label = '';

    switch (meta.type) {
      case 'chart_line':
        return null;
      case 'books_list':
        label = `Libros le\u00EDdos: ${meta.books.length} de ${meta.target}`;
        break;
      case 'finance_sum': {
        const total = meta.monthlyFlow.reduce((a, b) => a + b, 0);
        label = `Fondo: $${total.toLocaleString()} / $${meta.target.toLocaleString()}`;
        break;
      }
      case 'buckets': {
        const saved = meta.buckets.reduce((a, b) => a + b.saved, 0);
        const target = meta.buckets.reduce((a, b) => a + b.target, 0);
        label = `$${saved.toLocaleString()} / $${target.toLocaleString()} guardado`;
        break;
      }
      case 'health_score': {
        const greens = meta.clients.filter(c => c.status === 'green').length;
        label = `${greens}/${meta.clients.length} CLIENTES \u00D3PTIMOS`;
        break;
      }
      case 'funnel': {
        const totalSpend = meta.funnelData.reduce((a, b) => a + b.spend, 0);
        const totalLeads = meta.funnelData.reduce((a, b) => a + b.leads, 0);
        const cpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '0.00';
        label = `CPL PROMEDIO: $${cpl}`;
        break;
      }
      default:
        label = 'Progreso OKR';
    }

    return (
      <>
        <div className="flex justify-between" style={{ marginBottom: 8 }}>
          <span className="section-label" style={{ margin: 0 }}>{label}</span>
          <span className="okr-value" style={{ fontSize: 14, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill bg-${color}`} style={{ width: `${progress}%` }} />
        </div>
      </>
    );
  };

  return (
    <div className={`card card-${color} ${colSpanClass}`}>
      <div>
        <h3>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={e => updateText(metaIdx, 'title', e.currentTarget.innerText)}
            dangerouslySetInnerHTML={{ __html: meta.title }}
          />
        </h3>
      </div>
      <div
        className="desc"
        contentEditable
        suppressContentEditableWarning
        onBlur={e => updateText(metaIdx, 'description', e.currentTarget.innerText)}
        dangerouslySetInnerHTML={{ __html: meta.description }}
      />

      <div style={{ marginTop: 'auto' }}>
        {meta.type === 'chart_line' && (
          <div className="chart-container mini-chart">
            <ChartWidget
              metaTitle={meta.title}
              pilar={meta.pilar}
              chartData={meta.chartData}
              variant="mini"
            />
          </div>
        )}

        {renderProgress()}

        <button className="btn-cmd" onClick={() => onOpenModal(metaIdx)}>
          Abrir Centro de Comando
        </button>
      </div>
    </div>
  );
}

const MetaCard = memo(MetaCardInner);
export default MetaCard;
