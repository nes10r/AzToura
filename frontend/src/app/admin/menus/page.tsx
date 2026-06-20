'use client';

import { useEffect, useState } from 'react';
import { settingsService, MenuItem } from '@/services/settings';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';

const MENU_TYPES = ['navbar', 'footer', 'mobile'];

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuType, setMenuType] = useState('navbar');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: '', href: '', linkType: 'internal', target: '_self' });

  const load = () => {
    setLoading(true);
    settingsService.getMenus(menuType).then(r => setMenus(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [menuType]);

  const add = async () => {
    if (!form.label) return;
    await settingsService.createMenu({ ...form, menuType, sortOrder: menus.length });
    setForm({ label: '', href: '', linkType: 'internal', target: '_self' });
    setAdding(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    await settingsService.deleteMenu(id);
    load();
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div><h1 className="text-2xl font-bold text-slate-800">Menu Management</h1><p className="text-slate-500 text-sm mt-0.5">Manage navigation menus</p></div>

      <div className="flex items-center gap-2">
        {MENU_TYPES.map(t => (
          <button key={t} onClick={() => setMenuType(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${menuType === t ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
        <button onClick={() => setAdding(true)} className="ml-auto flex items-center gap-1.5 text-sm px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Label *</label>
              <input type="text" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                placeholder="Home" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Link</label>
              <input type="text" value={form.href} onChange={e => setForm(p => ({ ...p, href: e.target.value }))}
                placeholder="/" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700 capitalize">{menuType} menu</h2>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : menus.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No menu items. Add one above.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {menus.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.href || 'No link'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => remove(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
