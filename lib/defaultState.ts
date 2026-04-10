import type { AppState } from './types';

export const defaultState: AppState = {
  metas: [
    // PILAR 1: FUNDAMENTO
    {
      id: 1, pilar: 1,
      title: "\u{1F3CB}\u{FE0F}\u200D\u2642\uFE0F F\u00EDsico 80kg (Tarima)",
      description: "Recomposici\u00F3n corporal. Bajar a 75kg en Q2 y subir limpio a 80kg para cierre de a\u00F1o.",
      type: "chart_line",
      chartData: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [
          { label: "Proyecci\u00F3n (kg)", data: [91, 89, 88, 83, 79, 75, 77, 79, 80, 80, 80, 80] },
          { label: "Real (kg)", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
      },
      okrs: []
    },
    {
      id: 2, pilar: 1,
      title: "\uD83D\uDCBC Trabajo Reservamos",
      description: "Consolidar mi rol, documentar el ROI y asegurar el bono de fin de a\u00F1o.",
      type: "progress",
      okrs: [
        { text: "Q1: Sist. Deep Work matutino", done: false },
        { text: "Q2: Liderar proyecto de dise\u00F1o", done: false },
        { text: "Q3: Documentar ROI", done: false },
        { text: "Q4: Cierre impecable (Asegurar bono)", done: false }
      ]
    },
    {
      id: 3, pilar: 1,
      title: "\uD83D\uDCB0 Capital $200k",
      description: "Construir un fondo de ahorro e inversi\u00F3n de $200,000 MXN.",
      type: "finance_sum",
      monthlyFlow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      target: 200000
    },
    {
      id: 4, pilar: 1,
      title: "\uD83D\uDCDA 24 Libros",
      description: "Leer 24 libros en el a\u00F1o (2 por mes) para desarrollo personal.",
      type: "books_list",
      books: [],
      target: 24
    },
    {
      id: 5, pilar: 1,
      title: "\uD83D\uDEE1\uFE0F Honor Financiero",
      description: "Liquidar todas las deudas de consumo y mantener tarjetas en ceros.",
      type: "buckets",
      buckets: [
        { id: 1, name: "Banregio", target: 8000, saved: 0 },
        { id: 2, name: "Palacio + Sears", target: 8000, saved: 0 },
        { id: 3, name: "Tala/Otros", target: 4000, saved: 0 }
      ]
    },

    // PILAR 2: CRECIMIENTO
    {
      id: 6, pilar: 2,
      title: "\uD83C\uDF93 Rescate UNAM",
      description: "Aprobar materias, poner al d\u00EDa la curr\u00EDcula y mantener el estatus invicto.",
      type: "progress",
      okrs: [
        { text: "Q1: Configurar UIA y salvar atraso", done: false },
        { text: "Q2: Aprobar el 2do semestre invicto", done: false },
        { text: "Q3: Cursar Intersemestrales", done: false },
        { text: "Q4: Finalizar 3er semestre invicto", done: false }
      ]
    },
    {
      id: 7, pilar: 2,
      title: "\uD83C\uDF81 Equipar Familia",
      description: "Proveer tecnolog\u00EDa y experiencias clave para la familia.",
      type: "buckets",
      buckets: [
        { id: 1, name: "Licuadora + Concierto", target: 3000, saved: 0 },
        { id: 2, name: "Celulares", target: 12000, saved: 0 },
        { id: 3, name: "Laptops", target: 20000, saved: 0 }
      ]
    },
    {
      id: 8, pilar: 2,
      title: "\uD83C\uDFE0 El Santuario",
      description: "Reparar y mejorar nuestro hogar para que sea un refugio funcional y bonito.",
      type: "buckets",
      buckets: [
        { id: 1, name: "Fondo de Guerra (Urgencias)", target: 10000, saved: 0, category: "big" as const },
        { id: 2, name: "Mantenimiento Techo", target: 8000, saved: 0, category: "big" as const },
        { id: 3, name: "Dentista/Mascotas", target: 5000, saved: 0, category: "quick" as const },
        { id: 4, name: "Muebles/Decoraci\u00F3n", target: 5000, saved: 0, category: "quick" as const }
      ]
    },
    {
      id: 9, pilar: 2,
      title: "\uD83E\uDD1D Fidelidad Agencia",
      description: "Mantener los 4 clientes base de la agencia con reportes y resultados impecables.",
      type: "health_score",
      clients: [
        { name: "Cliente 1", status: "green" },
        { name: "Cliente 2", status: "green" },
        { name: "Cliente 3", status: "green" },
        { name: "Cliente 4", status: "green" }
      ]
    },

    // PILAR 3: COSECHA
    {
      id: 10, pilar: 3,
      title: "\uD83D\uDCC8 Agencia $50k",
      description: "Escalar la facturaci\u00F3n mensual recurrente de la agencia a $50,000 MXN.",
      type: "chart_line",
      chartData: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [
          { label: "Proyecci\u00F3n", data: [15, 20, 25, 30, 35, 40, 45, 50, 50, 50, 50, 50] },
          { label: "Real", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
      },
      okrs: []
    },
    {
      id: 11, pilar: 3,
      title: "\uD83D\uDE80 Escalar Rivenza",
      description: "Mejorar la marca, optimizar embudos de captaci\u00F3n y delegar pautas.",
      type: "funnel",
      funnelData: [
        { month: "Ene", spend: 0, leads: 0 }, { month: "Feb", spend: 0, leads: 0 },
        { month: "Mar", spend: 0, leads: 0 }, { month: "Abr", spend: 0, leads: 0 },
        { month: "May", spend: 0, leads: 0 }, { month: "Jun", spend: 0, leads: 0 },
        { month: "Jul", spend: 0, leads: 0 }, { month: "Ago", spend: 0, leads: 0 },
        { month: "Sep", spend: 0, leads: 0 }, { month: "Oct", spend: 0, leads: 0 },
        { month: "Nov", spend: 0, leads: 0 }, { month: "Dic", spend: 0, leads: 0 }
      ],
      okrs: [
        { text: "Q1: Rebranding + Pautas FB", done: false },
        { text: "Q2: Optimizar embudo (Bajar CPL)", done: false },
        { text: "Q3: Maximizar leads", done: false },
        { text: "Q4: Delegar u optimizar pauta", done: false }
      ]
    },
    {
      id: 12, pilar: 3,
      title: "\u2699\uFE0F Sistema Operativo",
      description: "Consolidar el ecosistema digital de seguimiento para que sea a prueba de fallas.",
      type: "heatmap",
      weeks: Array(52).fill(null)
    }
  ],
  inbox: [],
  notes: ""
};
