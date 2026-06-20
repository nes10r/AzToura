'use client';

import { useState } from 'react';
import { Save, Check, AlertTriangle, Server, Database, Activity } from 'lucide-react';

export default function SystemSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [paginationLimit, setPaginationLimit] = useState('20');
  const [uploadSizeLimit, setUploadSizeLimit] = useState('10');

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">System Settings</h1><p className="text-slate-500 text-sm mt-0.5">Advanced system configuration</p></div>
        <button onClick={save} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      {/* System status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Server,   label: 'API Server',    status: 'Online',  color: 'text-emerald-500' },
          { icon: Database, label: 'Neon Database',  status: 'Online',  color: 'text-emerald-500' },
          { icon: Activity, label: 'Memory Usage',   status: 'Normal',  color: 'text-blue-500'    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-sm font-semibold ${s.color}`}>{s.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-700">Performance</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Pagination Limit</label>
            <select value={paginationLimit} onChange={e => setPaginationLimit(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
              {[10, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload File Size Limit</label>
            <select value={uploadSizeLimit} onChange={e => setUploadSizeLimit(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} MB</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Maintenance Mode</p>
          <p className="text-xs text-amber-600 mt-0.5">Enable this in Site Settings to take the site offline for visitors. You can still access the admin panel.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Database</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Connection</span>
            <span className="text-emerald-600 font-medium">Neon PostgreSQL (Pooled)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">ORM</span>
            <span className="text-slate-700">Prisma v5</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Region</span>
            <span className="text-slate-700">EU Central (Frankfurt)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
