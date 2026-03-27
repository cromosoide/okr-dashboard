import type { Meta } from './types';

export function getMetaProgress(meta: Meta): number {
  switch (meta.type) {
    case 'books_list':
      return meta.target > 0
        ? Math.min(100, Math.round((meta.books.length / meta.target) * 100))
        : 0;

    case 'finance_sum': {
      const total = meta.monthlyFlow.reduce((a, b) => a + b, 0);
      return meta.target > 0
        ? Math.min(100, Math.round((total / meta.target) * 100))
        : 0;
    }

    case 'buckets': {
      if (!meta.buckets.length) return 0;
      const saved = meta.buckets.reduce((a, b) => a + b.saved, 0);
      const target = meta.buckets.reduce((a, b) => a + b.target, 0);
      return target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
    }

    case 'health_score': {
      if (!meta.clients.length) return 0;
      const greens = meta.clients.filter(c => c.status === 'green').length;
      return Math.round((greens / meta.clients.length) * 100);
    }

    case 'funnel': {
      if (!meta.funnelData.length) return 0;
      const active = meta.funnelData.filter(m => m.spend > 0 || m.leads > 0).length;
      return Math.round((active / 12) * 100);
    }

    case 'heatmap': {
      if (!meta.weeks.length) return 0;
      const done = meta.weeks.filter(Boolean).length;
      return Math.round((done / 52) * 100);
    }

    case 'chart_line':
    case 'progress':
    default: {
      if (!meta.okrs?.length) return 0;
      const done = meta.okrs.filter(o => o.done).length;
      return Math.round((done / meta.okrs.length) * 100);
    }
  }
}
