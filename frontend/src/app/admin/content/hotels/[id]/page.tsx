'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const HOTEL_TYPES = ['LUXURY', 'BOUTIQUE', 'BUDGET', 'RESORT', 'HOSTEL', 'APARTMENT'];

export default function HotelFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', address: '', city: '',
    stars: '3', pricePerNight: '', hotelType: 'LUXURY',
    coverImage: '', featured: false, active: true,
    amenities: '',
  });

  useEffect(() => {
    if (!isNew) {
      adminService.getHotelById(id).then(r => {
        const h = r.data;
        setForm({
          name: h.name || '', slug: h.slug || '', description: h.description || '',
          address: h.address || '', city: h.city || '',
          stars: String(h.stars || 3), pricePerNight: String(h.pricePerNight || ''),
          hotelType: h.hotelType || 'LUXURY', coverImage: h.coverImage || '',
          featured: h.featured || false, active: h.active ?? true,
          amenities: (h.amenities || []).join(', '),
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
    const body = {
      ...form,
      stars: parseInt(form.stars),
      pricePerNight: parseFloat(form.pricePerNight),
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (isNew) await adminService.createHotel(body);
      else await adminService.updateHotel(id, body);
      router.push('/admin/content/hotels');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/content/hotels" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Add New Hotel' : 'Edit Hotel'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isNew ? 'Create a new hotel listing' : `Editing hotel ID: ${id.slice(0, 8)}`}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hotel Name *</label>
            <input type="text" value={form.name} required
              onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="Four Seasons Baku" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <input type="text" value={form.slug} onChange={f('slug')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Location & Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input type="text" value={form.city} onChange={f('city')} placeholder="Baku"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stars</label>
              <select value={form.stars} onChange={f('stars')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input type="text" value={form.address} onChange={f('address')} placeholder="Neftchilar Ave 1"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Night (USD)</label>
              <input type="number" value={form.pricePerNight} onChange={f('pricePerNight')} min="0" step="0.01"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hotel Type</label>
              <select value={form.hotelType} onChange={f('hotelType')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amenities (comma-separated)</label>
            <input type="text" value={form.amenities} onChange={f('amenities')} placeholder="WiFi, Pool, Spa, Gym"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
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
            {isNew ? 'Create Hotel' : 'Save Changes'}
          </button>
          <Link href="/admin/content/hotels" className="px-6 py-2.5 border border-slate-200 text-sm rounded-xl hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
