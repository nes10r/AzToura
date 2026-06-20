'use client';

import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settings';
import { Shield, Search } from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-rose-100 text-rose-700',
  LOGIN:  'bg-amber-100 text-amber-700',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = (p = 1) => {
    setLoading(true);
    settingsService.getAuditLogs({ page: String(p), limit: '30' })
      .then(r => { setLogs(r.data || []); setTotal(r.pagination?.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.resource?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1><p className="text-slate-500 text-sm mt-0.5">Track all admin actions</p></div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="bg-transparent text-sm outline-none w-48 placeholder:text-slate-400" />
          </div>
          <span className="text-sm text-slate-500 ml-auto">{total} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['Action', 'Resource', 'User', 'IP Address', 'Timestamp'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No audit logs yet
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[log.action] ?? 'bg-slate-100 text-slate-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{log.resource} {log.resourceId ? `#${log.resourceId.slice(0, 8)}` : ''}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700 font-medium text-sm">{log.user?.name ?? 'System'}</p>
                      <p className="text-xs text-slate-400">{log.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.ipAddress ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 30 && (
          <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <span className="text-xs text-slate-500">Page {page} of {Math.ceil(total / 30)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 30)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
