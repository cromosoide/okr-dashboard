'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { produce } from 'immer';
import type { AppState, AppAction } from '@/lib/types';
import { defaultState } from '@/lib/defaultState';
import { supabase } from '@/lib/supabase';

const DB_KEY = 'bioMaquinaDataV6';

function reducer(state: AppState, action: AppAction): AppState {
  if (action.type === 'HYDRATE_FROM_CLOUD') return action.state;
  return produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_TEXT':
        (draft.metas[action.metaIdx] as Record<string, unknown>)[action.field] = action.value;
        break;

      case 'TOGGLE_OKR': {
        const m = draft.metas[action.metaIdx];
        if ('okrs' in m) m.okrs[action.okrIdx].done = action.done;
        break;
      }
      case 'EDIT_OKR_TEXT': {
        const m = draft.metas[action.metaIdx];
        if ('okrs' in m) m.okrs[action.okrIdx].text = action.text;
        break;
      }
      case 'ADD_OKR': {
        const m = draft.metas[action.metaIdx];
        if ('okrs' in m) m.okrs.push({ id: Date.now(), text: action.text, done: false });
        break;
      }
      case 'DELETE_OKR': {
        const m = draft.metas[action.metaIdx];
        if ('okrs' in m) m.okrs.splice(action.okrIdx, 1);
        break;
      }

      case 'ADD_BOOK': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'books_list') m.books.push(action.title);
        break;
      }
      case 'DELETE_BOOK': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'books_list') m.books.splice(action.bookIdx, 1);
        break;
      }

      case 'UPDATE_FINANCE_FLOW': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'finance_sum') m.monthlyFlow[action.monthIdx] = action.value;
        break;
      }

      case 'ADD_BUCKET': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'buckets') m.buckets.push({ id: Date.now(), name: action.name, target: action.target, saved: 0 });
        break;
      }
      case 'UPDATE_BUCKET': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'buckets') m.buckets[action.bucketIdx].saved = action.saved;
        break;
      }
      case 'UPDATE_BUCKET_TARGET': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'buckets') m.buckets[action.bucketIdx].target = action.target;
        break;
      }
      case 'UPDATE_BUCKET_NAME': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'buckets') m.buckets[action.bucketIdx].name = action.name;
        break;
      }
      case 'DELETE_BUCKET': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'buckets') m.buckets.splice(action.bucketIdx, 1);
        break;
      }

      case 'ADD_CLIENT': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'health_score') m.clients.push({ name: action.name, status: 'green' });
        break;
      }
      case 'UPDATE_CLIENT_STATUS': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'health_score') m.clients[action.clientIdx].status = action.status;
        break;
      }
      case 'UPDATE_CLIENT_NAME': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'health_score') m.clients[action.clientIdx].name = action.name;
        break;
      }

      case 'UPDATE_FUNNEL': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'funnel') m.funnelData[action.rowIdx][action.field] = action.value;
        break;
      }

      case 'TOGGLE_WEEK': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'heatmap') m.weeks[action.weekIdx] = !m.weeks[action.weekIdx];
        break;
      }

      case 'UPDATE_CHART_DATA': {
        const m = draft.metas[action.metaIdx];
        if (m.type === 'chart_line') m.chartData.datasets[1].data[action.pointIdx] = action.value;
        break;
      }

      case 'SAVE_NOTES':
        draft.notes = action.text;
        break;

      case 'ADD_INBOX_ITEM':
        draft.inbox.push({ id: Date.now(), text: action.text, category: action.category });
        break;

      case 'DELETE_INBOX_ITEM':
        draft.inbox = draft.inbox.filter(item => item.id !== action.id);
        break;

      case 'FACTORY_RESET':
        return JSON.parse(JSON.stringify(defaultState));
    }
  });
}

function loadState(): AppState {
  if (typeof window === 'undefined') return JSON.parse(JSON.stringify(defaultState));
  try {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultState));
  } catch {
    return JSON.parse(JSON.stringify(defaultState));
  }
}

export function useDashboard() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const isHydrating = useRef(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist to localStorage (instant, synchronous cache)
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  }, [state]);

  // Fetch from Supabase on mount — hydrate if cloud has data, then do initial save
  useEffect(() => {
    if (!supabase) { isHydrating.current = false; return; }
    supabase
      .from('okr_dashboard_state')
      .select('state')
      .eq('id', 'singleton')
      .single()
      .then(({ data }) => {
        const hasCloudData = data?.state && typeof data.state === 'object' && 'metas' in (data.state as Record<string, unknown>);
        if (hasCloudData) {
          dispatch({ type: 'HYDRATE_FROM_CLOUD', state: data.state as AppState });
        }
        // After hydration decision, mark complete and do initial save if cloud was empty
        setTimeout(() => {
          isHydrating.current = false;
          if (!hasCloudData) {
            supabase
              .from('okr_dashboard_state')
              .upsert({ id: 'singleton', state: stateRef.current, updated_at: new Date().toISOString() })
              .then(({ error }) => {
                if (error) console.error('Supabase initial sync error:', error);
              });
          }
        }, 100);
      })
      .then(undefined, () => {
        isHydrating.current = false;
      });
  }, []);

  // Debounced save to Supabase (cloud persistence)
  useEffect(() => {
    if (isHydrating.current || !supabase) return;
    const timer = setTimeout(() => {
      supabase
        .from('okr_dashboard_state')
        .upsert({ id: 'singleton', state, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('Supabase sync error:', error);
        });
    }, 1500);
    return () => clearTimeout(timer);
  }, [state]);

  const updateText = useCallback((metaIdx: number, field: 'title' | 'description', value: string) =>
    dispatch({ type: 'UPDATE_TEXT', metaIdx, field, value }), []);

  const toggleOKR = useCallback((metaIdx: number, okrIdx: number, done: boolean) =>
    dispatch({ type: 'TOGGLE_OKR', metaIdx, okrIdx, done }), []);

  const editOKRText = useCallback((metaIdx: number, okrIdx: number, text: string) =>
    dispatch({ type: 'EDIT_OKR_TEXT', metaIdx, okrIdx, text }), []);

  const addOKR = useCallback((metaIdx: number, text: string) =>
    dispatch({ type: 'ADD_OKR', metaIdx, text }), []);

  const deleteOKR = useCallback((metaIdx: number, okrIdx: number) =>
    dispatch({ type: 'DELETE_OKR', metaIdx, okrIdx }), []);

  const addBook = useCallback((metaIdx: number, title: string) =>
    dispatch({ type: 'ADD_BOOK', metaIdx, title }), []);

  const deleteBook = useCallback((metaIdx: number, bookIdx: number) =>
    dispatch({ type: 'DELETE_BOOK', metaIdx, bookIdx }), []);

  const updateFinanceFlow = useCallback((metaIdx: number, monthIdx: number, value: number) =>
    dispatch({ type: 'UPDATE_FINANCE_FLOW', metaIdx, monthIdx, value }), []);

  const addBucket = useCallback((metaIdx: number, name: string, target: number) =>
    dispatch({ type: 'ADD_BUCKET', metaIdx, name, target }), []);

  const updateBucket = useCallback((metaIdx: number, bucketIdx: number, saved: number) =>
    dispatch({ type: 'UPDATE_BUCKET', metaIdx, bucketIdx, saved }), []);

  const updateBucketTarget = useCallback((metaIdx: number, bucketIdx: number, target: number) =>
    dispatch({ type: 'UPDATE_BUCKET_TARGET', metaIdx, bucketIdx, target }), []);

  const updateBucketName = useCallback((metaIdx: number, bucketIdx: number, name: string) =>
    dispatch({ type: 'UPDATE_BUCKET_NAME', metaIdx, bucketIdx, name }), []);

  const deleteBucket = useCallback((metaIdx: number, bucketIdx: number) =>
    dispatch({ type: 'DELETE_BUCKET', metaIdx, bucketIdx }), []);

  const addClient = useCallback((metaIdx: number, name: string) =>
    dispatch({ type: 'ADD_CLIENT', metaIdx, name }), []);

  const updateClientStatus = useCallback((metaIdx: number, clientIdx: number, status: 'green' | 'yellow' | 'red') =>
    dispatch({ type: 'UPDATE_CLIENT_STATUS', metaIdx, clientIdx, status }), []);

  const updateClientName = useCallback((metaIdx: number, clientIdx: number, name: string) =>
    dispatch({ type: 'UPDATE_CLIENT_NAME', metaIdx, clientIdx, name }), []);

  const updateFunnel = useCallback((metaIdx: number, rowIdx: number, field: 'spend' | 'leads', value: number) =>
    dispatch({ type: 'UPDATE_FUNNEL', metaIdx, rowIdx, field, value }), []);

  const toggleWeek = useCallback((metaIdx: number, weekIdx: number) =>
    dispatch({ type: 'TOGGLE_WEEK', metaIdx, weekIdx }), []);

  const updateChartData = useCallback((metaIdx: number, pointIdx: number, value: number | null) =>
    dispatch({ type: 'UPDATE_CHART_DATA', metaIdx, pointIdx, value }), []);

  const saveNotes = useCallback((text: string) =>
    dispatch({ type: 'SAVE_NOTES', text }), []);

  const addInboxItem = useCallback((category: 'idea' | 'diseno' | 'ia' | 'purgatorio', text: string) =>
    dispatch({ type: 'ADD_INBOX_ITEM', category, text }), []);

  const deleteInboxItem = useCallback((id: number) =>
    dispatch({ type: 'DELETE_INBOX_ITEM', id }), []);

  const factoryReset = useCallback(() => {
    if (window.confirm('\uD83D\uDEA8 WARNING: Se borrar\u00E1 toda tu base de datos y progreso. \u00BFContinuar?')) {
      localStorage.removeItem(DB_KEY);
      dispatch({ type: 'FACTORY_RESET' });
      supabase
        .from('okr_dashboard_state')
        .upsert({ id: 'singleton', state: defaultState, updated_at: new Date().toISOString() });
    }
  }, []);

  return {
    state, dispatch,
    updateText, toggleOKR, editOKRText, addOKR, deleteOKR,
    addBook, deleteBook, updateFinanceFlow,
    addBucket, updateBucket, updateBucketTarget, updateBucketName, deleteBucket,
    addClient, updateClientStatus, updateClientName,
    updateFunnel, toggleWeek, updateChartData,
    saveNotes, addInboxItem, deleteInboxItem, factoryReset,
  };
}
