'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const EVENT_TYPES = ['CULTURAL', 'MUSIC', 'FOOD', 'SPORTS', 'FESTIVAL', 'EXHIBITION', 'CONFERENCE'];

export default function EventFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', location: '', city: '',
    startDate: '', endDate: '', eventType: 'CULTURAL', price: '0',
    maxAttendees: '', coverImage: '', featured: false, active: true,
  });

  useEffect(() => {
    if (!isNew) {
      adminService.getEventById(id).then(r => {
        const ev = r.data;
        setForm({
          name: ev.name || '', slug: ev.slug || '', description: ev.description || '',
          location: ev.location || '', city: ev.city || '',
          startDate: ev.startDate ? ev.startDate.slice(0, 16) : '',
          endDate: ev.endDate ? ev.endDate.slice(0, 16) : '',
          eventType: ev.eventType || 'CULTURAL', price: String(ev.price || 0),
          maxAttendees: String(ev.maxAttendees || ''),
          coverImage: ev.coverImage || '', featured: ev.featured || false, active: ev.active ?? true,
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
    const body = { ...form, price: parseFloat(form.price), maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined };
    try {
      if (isNew) await adminService.createEvent(body);
      else await adminService.updateEvent(id, body);
      router.push('/admin/content/events');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/content/events" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Add New Event' : 'Edit Event'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isNew ? 'Create a new event' : `Editing event ID: ${id.slice(0, 8)}`}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Name *</label>
            <input type="text" value={form.name} required
              onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="Novruz Festival 2025"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
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
          <h2 className="font-semibold text-slate-700">Event Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={f('startDate')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={f('endDate')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Type</label>
              <select value={form.eventType} onChange={f('eventType')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD, 0 = Free)</label>
              <input type="number" value={form.price} onChange={f('price')} min="0" step="0.01"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input type="text" value={form.city} onChange={f('city')} placeholder="Baku"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Attendees</label>
              <input type="number" value={form.maxAttendees} onChange={f('maxAttendees')} min="1" placeholder="500"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location / Venue</label>
            <input type="text" value={form.location} onChange={f('location')} placeholder="Baku Crystal Hall"
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
            {isNew ? 'Create Event' : 'Save Changes'}
          </button>
          <Link href="/admin/content/events" className="px-6 py-2.5 border border-slate-200 text-sm rounded-xl hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
