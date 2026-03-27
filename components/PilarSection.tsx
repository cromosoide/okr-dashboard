'use client';

import type { Meta } from '@/lib/types';
import MetaCard from './MetaCard';

interface Props {
  pilar: 1 | 2 | 3;
  title: string;
  colorClass: string;
  gridClass: string;
  metas: { meta: Meta; idx: number }[];
  onOpenModal: (idx: number) => void;
}

export default function PilarSection({ title, colorClass, gridClass, metas, onOpenModal }: Props) {
  return (
    <section className={metas[0]?.meta.pilar !== 1 ? 'section-mt' : ''}>
      <h2 className={`section-title ${colorClass}`}>{title}</h2>
      <div className={gridClass}>
        {metas.map(({ meta, idx }) => (
          <MetaCard key={meta.id} meta={meta} metaIdx={idx} onOpenModal={onOpenModal} />
        ))}
      </div>
    </section>
  );
}
