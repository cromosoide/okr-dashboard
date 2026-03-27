'use client';

import { useEffect, useState } from 'react';

function getTimeData() {
  const now = new Date();
  const month = now.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  const year = now.getFullYear();

  const qStartMonth = (quarter - 1) * 3;
  const qStart = new Date(year, qStartMonth, 1);
  const qEnd = new Date(year, qStartMonth + 3, 0, 23, 59, 59);
  const totalMs = qEnd.getTime() - qStart.getTime();
  const elapsedMs = now.getTime() - qStart.getTime();
  const pct = Math.min(100, Math.round((elapsedMs / totalMs) * 100));

  const dateStr = now.toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return {
    dateStr,
    qBadge: `Q${quarter} ${year}`,
    pct,
    pctText: `${pct}% completado`,
  };
}

export default function Header() {
  const [time, setTime] = useState(getTimeData);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeData()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header">
      <div className="container flex flex-col" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="header-title">TABLERO MAESTRO: LA BIO-MÁQUINA 2026</h1>
          <p className="header-sub">
            Abre cada tarjeta para gestionar OKRs. El progreso se calculará automáticamente (Roll-up).
          </p>
        </div>

        <div className="time-widget">
          <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>{time.dateStr}</span>
            <span className="badge">{time.qBadge}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${time.pct}%` }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8' }}>{time.pctText}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
