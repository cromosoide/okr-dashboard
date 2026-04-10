export type PilarColor = 'rose' | 'blue' | 'emerald';

export interface OKR {
  id?: number;
  text: string;
  done: boolean;
}

export interface ChartDataset {
  label: string;
  data: (number | null)[];
}

export interface ChartDataShape {
  labels: string[];
  datasets: [ChartDataset, ChartDataset];
}

// --- Meta type variants (discriminated union on `type`) ---

export interface MetaChartLine {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'chart_line';
  chartData: ChartDataShape;
  okrs: OKR[];
}

export interface MetaProgress {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'progress';
  okrs: OKR[];
}

export interface MetaFinanceSum {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'finance_sum';
  monthlyFlow: number[];
  target: number;
}

export interface MetaBooksList {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'books_list';
  books: string[];
  target: number;
}

export interface Bucket {
  id: number;
  name: string;
  target: number;
  saved: number;
  category?: 'quick' | 'big';
}

export interface MetaBuckets {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'buckets';
  buckets: Bucket[];
}

export interface Client {
  name: string;
  status: 'green' | 'yellow' | 'red';
}

export interface MetaHealthScore {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'health_score';
  clients: Client[];
}

export interface FunnelRow {
  month: string;
  spend: number;
  leads: number;
}

export interface MetaFunnel {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'funnel';
  funnelData: FunnelRow[];
  okrs: OKR[];
}

export interface WeekEntry {
  rating: number;
  note: string;
}

export interface MetaHeatmap {
  id: number;
  pilar: 1 | 2 | 3;
  title: string;
  description: string;
  type: 'heatmap';
  weeks: (WeekEntry | null)[];
}

export type Meta =
  | MetaChartLine
  | MetaProgress
  | MetaFinanceSum
  | MetaBooksList
  | MetaBuckets
  | MetaHealthScore
  | MetaFunnel
  | MetaHeatmap;

export interface InboxItem {
  id: number;
  text: string;
  category: 'idea' | 'diseno' | 'ia' | 'purgatorio';
}

export interface AppState {
  metas: Meta[];
  inbox: InboxItem[];
  notes: string;
}

// --- Reducer actions ---

export type AppAction =
  | { type: 'UPDATE_TEXT'; metaIdx: number; field: 'title' | 'description'; value: string }
  | { type: 'TOGGLE_OKR'; metaIdx: number; okrIdx: number; done: boolean }
  | { type: 'EDIT_OKR_TEXT'; metaIdx: number; okrIdx: number; text: string }
  | { type: 'ADD_OKR'; metaIdx: number; text: string }
  | { type: 'DELETE_OKR'; metaIdx: number; okrIdx: number }
  | { type: 'ADD_BOOK'; metaIdx: number; title: string }
  | { type: 'DELETE_BOOK'; metaIdx: number; bookIdx: number }
  | { type: 'UPDATE_FINANCE_FLOW'; metaIdx: number; monthIdx: number; value: number }
  | { type: 'ADD_BUCKET'; metaIdx: number; name: string; target: number; category?: 'quick' | 'big' }
  | { type: 'UPDATE_BUCKET'; metaIdx: number; bucketIdx: number; saved: number }
  | { type: 'UPDATE_BUCKET_TARGET'; metaIdx: number; bucketIdx: number; target: number }
  | { type: 'UPDATE_BUCKET_NAME'; metaIdx: number; bucketIdx: number; name: string }
  | { type: 'DELETE_BUCKET'; metaIdx: number; bucketIdx: number }
  | { type: 'ADD_CLIENT'; metaIdx: number; name: string }
  | { type: 'UPDATE_CLIENT_STATUS'; metaIdx: number; clientIdx: number; status: 'green' | 'yellow' | 'red' }
  | { type: 'UPDATE_CLIENT_NAME'; metaIdx: number; clientIdx: number; name: string }
  | { type: 'UPDATE_FUNNEL'; metaIdx: number; rowIdx: number; field: 'spend' | 'leads'; value: number }
  | { type: 'TOGGLE_WEEK'; metaIdx: number; weekIdx: number }
  | { type: 'RATE_WEEK'; metaIdx: number; weekIdx: number; rating: number }
  | { type: 'NOTE_WEEK'; metaIdx: number; weekIdx: number; note: string }
  | { type: 'UPDATE_CHART_DATA'; metaIdx: number; pointIdx: number; value: number | null }
  | { type: 'SAVE_NOTES'; text: string }
  | { type: 'ADD_INBOX_ITEM'; category: InboxItem['category']; text: string }
  | { type: 'DELETE_INBOX_ITEM'; id: number }
  | { type: 'FACTORY_RESET' }
  | { type: 'HYDRATE_FROM_CLOUD'; state: AppState };

// --- Helpers ---

export function getPilarColor(pilar: 1 | 2 | 3): PilarColor {
  return pilar === 1 ? 'rose' : pilar === 2 ? 'blue' : 'emerald';
}
