'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { ArrowLeft, Save, Loader2, User, Mail, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState('USER');

  useEffect(() => {
    adminService.getUserById(id).then(r => {
      setUser(r.data);
      setRole(r.data.role || 'USER');
    }).finally(() => setLoading(false));
  }, [id]);

  const saveRole = async () => {
    setSaving(true);
    await adminService.updateUserRole(id, role);
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  if (!user) return <div className="text-slate-500 text-center py-16">User not found</div>;

  const initials = user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">User Details</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${user.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { icon: User, label: 'Full Name', value: user.name },
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Shield, label: 'Role', value: user.role },
            { icon: Calendar, label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
              <row.icon className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-28">{row.label}</span>
              <span className="text-slate-700 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-700">Change Role</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <select value={role} onChange={e => setRole(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button onClick={saveRole} disabled={saving || role === user.role}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update Role
          </button>
        </div>
        {user.role === 'ADMIN' && role === 'USER' && (
          <p className="text-xs text-amber-600">Warning: This will remove admin access for this user.</p>
        )}
      </div>
    </div>
  );
}
