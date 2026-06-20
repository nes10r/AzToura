'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import { REGIONS } from '@/constants';
import { Category } from '@/types';

interface FormData {
  name: string; slug: string; description: string; region: string; city: string;
  coverImage: string; imageSpring: string; imageSummer: string; imageAutumn: string; imageWinter: string;
  latitude: string; longitude: string; featured: boolean; categoryId: string;
  seoTitle: string; seoDescription: string; active: boolean;
}

const EMPTY: FormData = {
  name: '', slug: '', description: '', region: '', city: '', coverImage: '',
  imageSpring: '', imageSummer: '', imageAutumn: '', imageWinter: '',
  latitude: '', longitude: '', featured: false, categoryId: '',
  seoTitle: '', seoDescription: '', active: true,
};

export default function DestinationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getCategories().then(r => setCategories(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) return;
    adminService.getDestinationById(id)
      .then(r => {
        const d = r.data;
        setForm({
          name: d.name || '', slug: d.slug || '', description: d.description || '',
          region: d.region || '', city: d.city || '', coverImage: d.coverImage || '',
          imageSpring: d.imageSpring || '', imageSummer: d.imageSummer || '',
          imageAutumn: d.imageAutumn || '', imageWinter: d.imageWinter || '',
          latitude: String(d.latitude || ''), longitude: String(d.longitude || ''),
          featured: d.featured || false, categoryId: d.categoryId || '',
          seoTitle: d.seoTitle || '', seoDescription: d.seoDescription || '',
          active: d.active !== false,
        });
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (name: string, value: string | boolean) => {
    setForm(p => ({ ...p, [name]: value }));
    if (name === 'name' && isNew) {
      const slug = (value as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setForm(p => ({ ...p, [name]: value as string, slug }));
    }
  };

  const save = async () => {
    if (!form.name || !form.description || !form.region) {
      setError('Name, description, and region are required.');
      return;
    }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        categoryId: form.categoryId || null,
        coverImage: form.coverImage || null,
        imageSpring: form.imageSpring || null,
        imageSummer: form.imageSummer || null,
        imageAutumn: form.imageAutumn || null,
        imageWinter: form.imageWinter || null,
      };
      if (isNew) await adminService.createDestination(payload);
      else await adminService.updateDestination(id, payload);
      router.push('/admin/content/destinations');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this destination?')) return;
    await adminService.deleteDestination(id);
    router.push('/admin/content/destinations');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'New Destination' : 'Edit Destination'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{isNew ? 'Add a new destination' : `Editing: ${form.name}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button onClick={remove} className="flex items-center gap-1.5 text-sm px-3 py-2 border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-60">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-slate-700">Basic Info</h2>
            {[
              { label: 'Name',  name: 'name',  placeholder: 'e.g. Baku' },
              { label: 'Slug',  name: 'slug',  placeholder: 'e.g. baku' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                <input type="text" value={(form as any)[f.name]} onChange={e => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                <option value="">— No category —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={5}
                placeholder="Describe this destination..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-y"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-slate-700">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Region</label>
                <select value={form.region} onChange={e => set('region', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                  <option value="">Select region</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="e.g. Baku"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude</label>
                <input type="number" value={form.latitude} onChange={e => set('latitude', e.target.value)}
                  placeholder="40.4093"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
                <input type="number" value={form.longitude} onChange={e => set('longitude', e.target.value)}
                  placeholder="49.8671"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-slate-700">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SEO Title</label>
              <input type="text" value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)}
                placeholder="Page title for search engines"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SEO Description</label>
              <textarea value={form.seoDescription} onChange={e => set('seoDescription', e.target.value)}
                rows={3} placeholder="Meta description for search results"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-slate-700">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <button onClick={() => set('featured', !form.featured)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-slate-700">Featured destination</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button onClick={() => set('active', !form.active)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-slate-700">Active / visible</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-semibold text-slate-700">Cover Image</h2>
            <input type="text" value={form.coverImage} onChange={e => set('coverImage', e.target.value)}
              placeholder="https://... or /images/..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            {form.coverImage && (
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100">
                <img src={form.coverImage} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-700">Seasonal Images</h2>
              <p className="text-xs text-slate-400 mt-0.5">Auto-displayed based on current season & live weather</p>
            </div>
            {([
              { label: '🌸 Spring',  key: 'imageSpring'  },
              { label: '☀️ Summer',  key: 'imageSummer'  },
              { label: '🍂 Autumn',  key: 'imageAutumn'  },
              { label: '❄️ Winter',  key: 'imageWinter'  },
            ] as { label: string; key: keyof FormData }[]).map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                <input
                  type="text"
                  value={(form[f.key] as string) ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                />
                {(form[f.key] as string) && (
                  <div className="mt-1.5 w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                    <img src={form[f.key] as string} alt={f.label} className="w-full h-full object-cover"
                      onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
