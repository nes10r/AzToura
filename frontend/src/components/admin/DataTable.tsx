'use client';

import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Trash2, Edit, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  addHref?: string;
  addLabel?: string;
  onDelete?: (row: T) => void | Promise<void>;
  onEdit?: (row: T) => void;
  editHref?: (row: T) => string;
  title?: string;
  filters?: React.ReactNode;
  total?: number;
  page?: number;
  onPageChange?: (p: number) => void;
  pageSize?: number;
}

export default function DataTable<T extends { id: string }>({
  data, columns, loading, searchPlaceholder = 'Search...', addHref, addLabel = 'Add New',
  onDelete, editHref, title, filters, total, page = 1, onPageChange, pageSize = 20,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const filtered = data.filter(row =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av === bv) return 0;
    const cmp = String(av) > String(bv) ? 1 : -1;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map(r => r.id)));
  };

  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          {title && <h2 className="font-semibold text-slate-700 shrink-0">{title}</h2>}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 flex-1 sm:w-64 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
            />
          </div>
          {filters}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selected.size > 0 && onDelete && (
            <button
              disabled={bulkDeleting}
              onClick={async () => {
                if (!confirm(`Delete ${selected.size} selected item(s)? This cannot be undone.`)) return;
                setBulkDeleting(true);
                const rows = data.filter(r => selected.has(r.id));
                for (const row of rows) {
                  try { await onDelete(row); } catch { /* continue */ }
                }
                setSelected(new Set());
                setBulkDeleting(false);
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 border border-rose-200 rounded-lg px-3 py-1.5 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {bulkDeleting ? 'Deleting...' : `Delete (${selected.size})`}
            </button>
          )}
          {addHref && (
            <Link
              href={addHref}
              className="flex items-center gap-1.5 text-sm bg-emerald-600 text-white rounded-lg px-3 py-1.5 hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              {addLabel}
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === sorted.length && sorted.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-700',
                    col.className,
                  )}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-medium text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-4 py-3"><div className="h-4 w-4 bg-slate-100 rounded animate-pulse" /></td>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                  ))}
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse ml-auto" /></td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr key={row.id} className={cn('border-b border-slate-50 hover:bg-slate-50 transition-colors', selected.has(row.id) && 'bg-emerald-50/50')}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => setSelected(prev => {
                        const n = new Set(prev);
                        n.has(row.id) ? n.delete(row.id) : n.add(row.id);
                        return n;
                      })}
                      className="rounded"
                    />
                  </td>
                  {columns.map(col => (
                    <td key={String(col.key)} className={cn('px-4 py-3 text-slate-700', col.className)}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editHref && (
                        <Link
                          href={editHref(row)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total && total > pageSize && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-sm">
          <span className="text-slate-500 text-xs">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, page - 3), Math.min(totalPages, page + 2)
            ).map(p => (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                  p === page ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h3 className="font-bold text-slate-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const row = data.find(r => r.id === deleteId);
                  setDeleteId(null);
                  if (row) {
                    try { await onDelete?.(row); }
                    catch (err: any) { alert(err?.response?.data?.message || 'Delete failed'); }
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
