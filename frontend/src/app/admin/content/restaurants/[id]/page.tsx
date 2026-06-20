'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CUISINES = ['AZERBAIJANI', 'TURKISH', 'EUROPEAN', 'ASIAN', 'AMERICAN', 'MEDITERRANEAN', 'SEAFOOD', 'VEGETARIAN'];
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];

export default function RestaurantFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', address: '', city: '',
    cuisine: 'AZERBAIJANI', priceRange: '$$', openingHours: '',
    coverImage: '', featured: false, active: true,
  });

  useEffect(() => {
    if (!isNew) {
      adminService.getRestaurantById(id).then(r => {
        const rs = r.data;
        setForm({
          name: rs.name || '', slug: rs.slug || '', description: rs.description || '',
          address: rs.address || '', city: rs.city || '',
          cuisine: rs.cuisine || 'AZERBAIJANI', priceRange: rs.priceRange || '$$',
          openingHours: rs.openingHours || '', coverImage: rs.coverImage || '',
          featured: rs.featured || false, active: rs.active ?? true,
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminService.createRestaurant(form);
      else await adminService.updateRestaurant(id, form);
      router.push('/admin/content/restaurants');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/content/restaurants" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Add New Restaurant' : 'Edit Restaurant'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isNew ? 'Create a new restaurant listing' : `Editing ID: ${id.slice(0, 8)}`}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Restaurant Name *</label>
            <input type="text" value={form.name} required
              onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="Firuze Restaurant"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <input type="text" value={form.slug} onChange={f('slug')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input type="text" value={form.city} onChange={f('city')} placeholder="Baku"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price Range</label>
              <select value={form.priceRange} onChange={f('priceRange')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input type="text" value={form.address} onChange={f('address')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cuisine</label>
              <select value={form.cuisine} onChange={f('cuisine')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Opening Hours</label>
              <input type="text" value={form.openingHours} onChange={f('openingHours')} placeholder="09:00 - 22:00"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Media</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
            <input type="url" value={form.coverImage} onChange={f('coverImage')} placeholder="https://..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-slate-200"
                onError={e => (e.currentTarget.style.display = 'none')} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Visibility</h2>
          {([['featured', 'Featured', 'Show in featured sections'], ['active', 'Active', 'Visible to users']] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
              <button type="button" onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? 'Create Restaurant' : 'Save Changes'}
          </button>
          <Link href="/admin/content/restaurants" className="px-6 py-2.5 border border-slate-200 text-sm rounded-xl hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
