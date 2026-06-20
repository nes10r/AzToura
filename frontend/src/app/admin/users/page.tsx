'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { formatDate } from '@/lib/utils';
import { Search, Shield, UserX } from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-violet-100 text-violet-700',
  USER:  'bg-slate-100 text-slate-600',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminService.getUsers({ limit: '200' }).then(r => setUsers(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (id: string, role: string) => {
    setUpdating(id);
    try { await adminService.updateUserRole(id, role); load(); }
    finally { setUpdating(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Users</h1><p className="text-slate-500 text-sm mt-0.5">Manage user accounts</p></div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 flex-1 sm:w-64 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400" />
          </div>
          <span className="text-sm text-slate-500 ml-auto">{users.length} users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No users found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">{u.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role] ?? ''}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                          disabled={updating === u.id}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-400 bg-white disabled:opacity-50"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
