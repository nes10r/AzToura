'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '' });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminService.getCategories()
      .then(r => setCats(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return;
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSaving(true);
    try {
      await adminService.createCategory({ ...form, slug });
      setForm({ name: '', slug: '', description: '', icon: '' });
      setAdding(false);
      load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await adminService.deleteCategory(id);
      load();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage content categories</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
              <input type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="Nature" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="nature" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="🌿" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="Optional description" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={add} disabled={saving}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-60">
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['Icon', 'Name', 'Slug', 'Description', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {[1,2,3,4,5].map(j => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : cats.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No categories. Add one above.</td></tr>
              ) : (
                cats.map(cat => (
                  <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-xl">{cat.icon || '—'}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{cat.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
