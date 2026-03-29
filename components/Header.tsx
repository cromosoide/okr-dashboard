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
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return {
    dateStr,
    qBadge: `Q${quarter} ${year} · ${pct}%`,
    pct,
  };
}

export default function Header() {
  const [time, setTime] = useState(getTimeData);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeData()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${time.pct}%` }} />
      </div>

      <header className="header">
        <div className="container header-layout">
          <div className="header-text">
            <h1 className="header-title">La Bio-Máquina 2026</h1>
            <p className="header-sub">
              Abre cada tarjeta para gestionar OKRs. El progreso se calculará automáticamente.
            </p>
          </div>
          <div className="time-widget">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{time.dateStr}</span>
            <span className="badge" style={{ marginLeft: 8 }}>{time.qBadge}</span>
          </div>
        </div>
      </header>
    </>
  );
}
