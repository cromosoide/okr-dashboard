'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import type { ChartDataShape } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const colorsHex = {
  rose:    { main: '#E03C31', light: '#ffe4e6' },
  blue:    { main: '#005A9C', light: '#dbeafe' },
  emerald: { main: '#E8A317', light: '#fef3c7' },
};

interface ChartWidgetProps {
  metaTitle: string;
  pilar: 1 | 2 | 3;
  chartData: ChartDataShape;
  variant: 'mini' | 'full';
}

export default function ChartWidget({ metaTitle, pilar, chartData, variant }: ChartWidgetProps) {
  const color = pilar === 1 ? 'rose' : pilar === 2 ? 'blue' : 'emerald';
  const palette = colorsHex[color];

  const isWeight = /80kg|85kg/i.test(metaTitle);
  const isFinancial = /Capital|Agencia/i.test(metaTitle);
  const chartType = isFinancial ? 'bar' : 'line';
  const yMin = isWeight ? 70 : 0;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: chartData.datasets[0].label,
        data: chartData.datasets[0].data,
        borderColor: palette.main,
        backgroundColor: chartType === 'bar' ? palette.light : 'transparent',
        borderDash: chartType === 'line' ? [5, 5] : [],
        borderWidth: 2,
        fill: false,
        borderRadius: chartType === 'bar' ? 4 : 0,
        pointRadius: variant === 'mini' ? 2 : 4,
      },
      {
        label: chartData.datasets[1].label,
        data: chartData.datasets[1].data,
        borderColor: palette.main,
        backgroundColor: palette.main,
        borderWidth: 3,
        fill: false,
        borderRadius: chartType === 'bar' ? 4 : 0,
        pointRadius: variant === 'mini' ? 2 : 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: variant === 'full' },
    },
    scales: {
      y: {
        display: variant === 'full',
        min: yMin,
        grid: { display: variant === 'full' },
      },
      x: {
        display: true,
        ticks: { font: { size: variant === 'mini' ? 9 : 12 } },
        grid: { display: false },
      },
    },
  };

  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return <ChartComponent data={data} options={options} />;
}
