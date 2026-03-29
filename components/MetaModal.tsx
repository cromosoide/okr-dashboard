'use client';

import dynamic from 'next/dynamic';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { getPilarColor } from '@/lib/types';
import ModalOKRList from './modal/ModalOKRList';
import ModalFinance from './modal/ModalFinance';
import ModalBooks from './modal/ModalBooks';
import ModalBuckets from './modal/ModalBuckets';
import ModalHealthScore from './modal/ModalHealthScore';
import ModalFunnel from './modal/ModalFunnel';
import ModalHeatmap from './modal/ModalHeatmap';

const ChartWidget = dynamic(() => import('./ChartWidget'), { ssr: false });

interface Props {
  metaIdx: number;
  onClose: () => void;
}

export default function MetaModal({ metaIdx, onClose }: Props) {
  const { state, updateChartData } = useDashboardContext();
  const meta = state.metas[metaIdx];
  const color = getPilarColor(meta.pilar);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const renderContent = () => {
    switch (meta.type) {
      case 'chart_line':
        return null;
      case 'finance_sum':
        return <ModalFinance metaIdx={metaIdx} meta={meta} />;
      case 'books_list':
        return <ModalBooks metaIdx={metaIdx} meta={meta} />;
      case 'buckets':
        return <ModalBuckets metaIdx={metaIdx} meta={meta} />;
      case 'health_score':
        return <ModalHealthScore metaIdx={metaIdx} meta={meta} />;
      case 'funnel':
        return <ModalFunnel metaIdx={metaIdx} meta={meta} />;
      case 'heatmap':
        return <ModalHeatmap metaIdx={metaIdx} meta={meta} />;
      case 'progress':
        return <ModalOKRList metaIdx={metaIdx} okrs={meta.okrs} />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ borderTop: `3px solid var(--${color}-main)` }}>
        <div className="modal-header">
          <div>
            <h3>{meta.title}</h3>
            <p>&nbsp;</p>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="info-box">{meta.description}</div>

          {meta.type === 'chart_line' && (
            <>
              <span className="section-label">Métricas de Rendimiento (Real vs Meta)</span>
              <div className="input-grid grid grid-4">
                {meta.chartData.labels.map((label, i) => (
                  <div key={i} className="input-group">
                    <label>{label.toUpperCase()} REAL</label>
                    <input
                      type="number"
                      defaultValue={meta.chartData.datasets[1].data[i] ?? ''}
                      onChange={e => updateChartData(
                        metaIdx, i,
                        e.target.value === '' ? null : parseFloat(e.target.value)
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="chart-container">
                <ChartWidget
                  metaTitle={meta.title}
                  pilar={meta.pilar}
                  chartData={meta.chartData}
                  variant="full"
                />
              </div>
            </>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
