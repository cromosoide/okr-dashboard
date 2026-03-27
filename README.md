# Tablero Maestro: La Bio-Maquina 2026

Dashboard personal de OKRs con 12 metas organizadas en 3 pilares: Fundamento, Crecimiento y Cosecha.

**Live:** [okr-dashboard-rosy.vercel.app](https://okr-dashboard-rosy.vercel.app)

## Stack

- **Next.js 15.3** (App Router + TypeScript + Tailwind CSS)
- **Supabase** (persistencia en la nube, JSONB)
- **localStorage** (cache local para UI instantanea)
- **Chart.js** + react-chartjs-2 (graficas)
- **Immer** (estado inmutable con useReducer)

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local  # agregar credenciales de Supabase
npm run dev
```

## Estructura

```
app/          - Pages y layout (App Router)
components/   - UI: Header, MetaCard, MetaModal, InboxPanel, ChartWidget
components/modal/ - 7 tipos de modal (OKR, Finance, Books, Buckets, etc.)
hooks/        - useDashboard (estado + localStorage + Supabase sync)
lib/          - types, defaultState, supabase client, getMetaProgress
contexts/     - DashboardContext (React Context)
```
