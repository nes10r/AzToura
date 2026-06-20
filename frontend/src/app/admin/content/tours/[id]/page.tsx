'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import {
  ArrowLeft, Save, Loader2, X, MapPin, Clock, Users, DollarSign,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { Destination, Category } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Activity { time: string; title: string; desc: string; icon: string; category: string }
interface ItineraryDay { day: number; title: string; summary: string; activities: Activity[] }
interface FAQItem { q: string; a: string }
interface Inclusions { included: string[]; excluded: string[] }

const TABS = ['Overview', 'Destinations', 'Itinerary', "What's Included", 'FAQ & Extras'] as const;
type Tab = typeof TABS[number];

const TOUR_TYPES = ['CULTURAL', 'ADVENTURE', 'NATURE', 'HISTORICAL', 'CULINARY', 'PHOTOGRAPHY'];
const DIFFICULTY = [
  { value: 'EASY', label: 'Easy', color: 'text-emerald-600 bg-emerald-50' },
  { value: 'MODERATE', label: 'Moderate', color: 'text-amber-600 bg-amber-50' },
  { value: 'HARD', label: 'Hard', color: 'text-rose-600 bg-rose-50' },
];
const ACTIVITY_CATEGORIES = [
  { value: 'Hotel',       emoji: '🏨', color: 'bg-blue-50 text-blue-700' },
  { value: 'Museum',      emoji: '🏛️', color: 'bg-purple-50 text-purple-700' },
  { value: 'History',     emoji: '⚔️',  color: 'bg-amber-50 text-amber-700' },
  { value: 'Heritage',    emoji: '🏰', color: 'bg-orange-50 text-orange-700' },
  { value: 'Restaurant',  emoji: '🍽️', color: 'bg-rose-50 text-rose-700' },
  { value: 'Food',        emoji: '🍵', color: 'bg-yellow-50 text-yellow-700' },
  { value: 'Culture',     emoji: '🎨', color: 'bg-pink-50 text-pink-700' },
  { value: 'Nature',      emoji: '🌿', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'Viewpoint',   emoji: '📸', color: 'bg-cyan-50 text-cyan-700' },
  { value: 'Transport',   emoji: '🚌', color: 'bg-slate-100 text-slate-600' },
  { value: 'Leisure',     emoji: '🌃', color: 'bg-indigo-50 text-indigo-700' },
  { value: 'Shopping',    emoji: '🛍️', color: 'bg-fuchsia-50 text-fuchsia-700' },
  { value: 'Sport',       emoji: '🥾', color: 'bg-lime-50 text-lime-700' },
];

// ─── Category Picker ─────────────────────────────────────────────────────────

function CategoryPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cat = ACTIVITY_CATEGORIES.find(c => c.value === value) || ACTIVITY_CATEGORIES[10];
  const DROPDOWN_W = 260;
  const DROPDOWN_H = 260;

  const handleToggle = () => {
    if (pos) { setPos(null); return; }
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const left = Math.min(r.left, window.innerWidth - DROPDOWN_W - 8);
      const top = (window.innerHeight - r.bottom < DROPDOWN_H + 8)
        ? r.top - DROPDOWN_H - 6
        : r.bottom + 6;
      setPos({ top, left });
    }
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold w-full justify-between border border-transparent hover:border-current/20 transition-all ${cat.color}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{cat.emoji}</span>
          <span>{cat.value}</span>
        </span>
        <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
      </button>

      {pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPos(null)} />
          <div
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: DROPDOWN_W, zIndex: 50 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5"
          >
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Category</p>
            <div className="grid grid-cols-2 gap-1">
              {ACTIVITY_CATEGORIES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => { onChange(c.value); setPos(null); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-left
                    ${c.color}
                    ${c.value === value
                      ? 'ring-2 ring-offset-1 ring-current/30 scale-[1.03]'
                      : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                >
                  <span className="text-sm leading-none">{c.emoji}</span>
                  <span className="truncate">{c.value}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Small reusable helpers ───────────────────────────────────────────────────

function TagInput({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [val, setVal] = useState('');
  const add = () => { if (val.trim()) { onChange([...items, val.trim()]); setVal(''); } };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs rounded-full px-3 py-1.5">
            {item}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        <button type="button" onClick={add}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TourFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [additionalIds, setAdditionalIds] = useState<string[]>([]);
  const [destSearch, setDestSearch] = useState('');

  // Overview form
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', duration: '', maxGroupSize: '',
    tourType: 'CULTURAL', difficulty: 'EASY', coverImage: '', featured: false,
    destinationId: '', categoryId: '', languages: 'AZ / EN / RU', meetingPoint: '',
  });

  // Rich content
  const [highlights, setHighlights] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [inclusions, setInclusions] = useState<Inclusions>({ included: [], excluded: [] });
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);

  // Itinerary UI state
  const [openDay, setOpenDay] = useState<number | null>(0);

  useEffect(() => {
    adminService.getDestinations({ limit: '200' }).then(r => setDestinations(r.data || [])).catch(() => {});
    adminService.getCategories().then(r => setCategories(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isNew) {
      adminService.getTourById(id).then(r => {
        const t = r.data;
        setForm({
          name: t.name || '', slug: t.slug || '', description: t.description || '',
          price: String(t.price || ''), duration: String(t.duration || ''), maxGroupSize: String(t.maxGroupSize || ''),
          tourType: t.tourType || 'CULTURAL', difficulty: t.difficulty || 'EASY',
          coverImage: t.coverImage || '', featured: t.featured || false,
          destinationId: t.destinationId || '', categoryId: t.categoryId || '',
          languages: t.languages || 'AZ / EN / RU', meetingPoint: t.meetingPoint || '',
        });
        if (t.additionalDestinations) setAdditionalIds(t.additionalDestinations.map((d: any) => d.destinationId));
        if (t.highlights) setHighlights(t.highlights as string[]);
        if (t.itinerary) setItinerary(t.itinerary as ItineraryDay[]);
        if (t.inclusions) setInclusions(t.inclusions as Inclusions);
        if (t.faq) setFaq(t.faq as FAQItem[]);
        if (t.packingList) setPackingList(t.packingList as string[]);
      }).finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, e.target.value);
  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const toggleAdditional = (destId: string) =>
    setAdditionalIds(prev => prev.includes(destId) ? prev.filter(d => d !== destId) : [...prev, destId]);

  // Itinerary helpers
  const addDay = () => {
    const day = itinerary.length + 1;
    setItinerary([...itinerary, { day, title: `Day ${day}`, summary: '', activities: [] }]);
    setOpenDay(itinerary.length);
  };
  const removeDay = (i: number) => setItinerary(itinerary.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 })));
  const updateDay = (i: number, patch: Partial<ItineraryDay>) => setItinerary(itinerary.map((d, j) => j === i ? { ...d, ...patch } : d));
  const addActivity = (dayIdx: number) =>
    updateDay(dayIdx, { activities: [...itinerary[dayIdx].activities, { time: '', title: '', desc: '', icon: 'map', category: 'Leisure' }] });
  const updateActivity = (dayIdx: number, actIdx: number, patch: Partial<Activity>) =>
    updateDay(dayIdx, { activities: itinerary[dayIdx].activities.map((a, k) => k === actIdx ? { ...a, ...patch } : a) });
  const removeActivity = (dayIdx: number, actIdx: number) =>
    updateDay(dayIdx, { activities: itinerary[dayIdx].activities.filter((_, k) => k !== actIdx) });

  // FAQ helpers
  const addFaq = () => setFaq([...faq, { q: '', a: '' }]);
  const updateFaq = (i: number, patch: Partial<FAQItem>) => setFaq(faq.map((f, j) => j === i ? { ...f, ...patch } : f));
  const removeFaq = (i: number) => setFaq(faq.filter((_, j) => j !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destinationId) { alert('Please select a primary destination'); return; }
    setSaving(true);
    const body = {
      ...form,
      price: parseFloat(form.price),
      duration: parseInt(form.duration),
      maxGroupSize: parseInt(form.maxGroupSize),
      categoryId: form.categoryId || null,
      languages: form.languages || null,
      meetingPoint: form.meetingPoint || null,
      additionalDestinationIds: additionalIds,
      highlights: highlights.length ? highlights : null,
      itinerary: itinerary.length ? itinerary : null,
      inclusions: (inclusions.included.length || inclusions.excluded.length) ? inclusions : null,
      faq: faq.length ? faq : null,
      packingList: packingList.length ? packingList : null,
    };
    try {
      if (isNew) await adminService.createTour(body);
      else await adminService.updateTour(id, body);
      router.push('/admin/content/tours');
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  const primaryDest = destinations.find(d => d.id === form.destinationId);
  const selectedAdditional = destinations.filter(d => additionalIds.includes(d.id));
  const filteredDests = destinations
    .filter(d => d.id !== form.destinationId &&
      (d.name.toLowerCase().includes(destSearch.toLowerCase()) || d.region.toLowerCase().includes(destSearch.toLowerCase())))
    .sort((a, b) => {
      if (!primaryDest) return 0;
      return (a.region === primaryDest.region ? 0 : 1) - (b.region === primaryDest.region ? 0 : 1) || a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-5xl space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/content/tours" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Add New Tour' : 'Edit Tour'}</h1>
            <p className="text-slate-500 text-sm">{form.name || 'Tour details'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/content/tours" className="px-4 py-2 border border-slate-200 text-sm rounded-xl hover:bg-slate-50">Cancel</Link>
          <button onClick={submit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? 'Create Tour' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={submit}>

        {/* ═══════════════════ TAB: OVERVIEW ═══════════════════ */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Basic Info</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tour Name <span className="text-rose-500">*</span></label>
                  <input type="text" value={form.name} required
                    onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))}
                    placeholder="e.g. Sheki–Gabala Mountain Tour"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-400">
                    <span className="px-3 py-2.5 text-slate-400 text-sm bg-slate-50 border-r border-slate-200">/tours/</span>
                    <input type="text" value={form.slug} onChange={f('slug')} className="flex-1 px-3 py-2.5 text-sm outline-none font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={f('description')} rows={5}
                    placeholder="Describe what this tour offers, what's included, key highlights..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tour Details</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'price', label: 'Price', icon: DollarSign, suffix: 'USD', placeholder: '150' },
                    { key: 'duration', label: 'Duration', icon: Clock, suffix: 'days', placeholder: '3' },
                    { key: 'maxGroupSize', label: 'Group Size', icon: Users, suffix: 'pax', placeholder: '12' },
                  ].map(({ key, label, icon: Icon, suffix, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="number" value={(form as any)[key]} onChange={f(key)} min="0" placeholder={placeholder}
                          className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-emerald-400" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tour Type</label>
                  <div className="flex flex-wrap gap-2">
                    {TOUR_TYPES.map(t => (
                      <button key={t} type="button" onClick={() => set('tourType', t)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.tourType === t ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTY.map(d => (
                      <button key={d.value} type="button" onClick={() => set('difficulty', d.value)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.difficulty === d.value ? `${d.color} border-current` : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tour Info (shown in sidebar)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select value={form.categoryId} onChange={f('categoryId')}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                      <option value="">— No category —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Languages</label>
                    <input type="text" value={form.languages} onChange={f('languages')}
                      placeholder="AZ / EN / RU"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure / Meeting Point</label>
                  <input type="text" value={form.meetingPoint} onChange={f('meetingPoint')}
                    placeholder="e.g. Nizami Street, Baku (in front of Azərenerji building)"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</h2>
                {[{ key: 'featured', label: 'Featured', desc: 'Show in highlights' }].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <div><p className="text-sm font-medium text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
                    <button type="button" onClick={() => set(key, !(form as any)[key])}
                      className={`relative shrink-0 transition-colors rounded-full`}
                      style={{ width: 40, height: 22, background: (form as any)[key] ? '#10b981' : '#e2e8f0' }}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(form as any)[key] ? 'translate-x-[18px]' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Cover Image</h2>
                <input type="text" value={form.coverImage} onChange={f('coverImage')} placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                <div className={`rounded-xl overflow-hidden bg-slate-100 ${form.coverImage ? 'h-40' : 'h-20 flex items-center justify-center'}`}>
                  {form.coverImage
                    ? <img src={form.coverImage} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget.parentElement as any).style.display = 'none'; }} />
                    : <p className="text-xs text-slate-400">No image</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: DESTINATIONS ═══════════════════ */}
        {activeTab === 'Destinations' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Destination <span className="text-rose-500">*</span></label>
              <select value={form.destinationId} onChange={f('destinationId')} required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                <option value="">— Select —</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name} · {d.region}</option>)}
              </select>
              {primaryDest && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">{primaryDest.name}</span>
                  <span className="text-emerald-400">·</span>
                  <span>{primaryDest.region}</span>
                  <span className="ml-auto bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">PRIMARY</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Route Stops</label>
                <span className="text-xs text-slate-400">Additional destinations</span>
              </div>
              {selectedAdditional.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {selectedAdditional.map((d, i) => (
                    <span key={d.id} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm text-slate-700 text-xs rounded-full px-2.5 py-1">
                      <span className="w-4 h-4 bg-slate-700 text-white rounded-full flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      {d.name}
                      <button type="button" onClick={() => toggleAdditional(d.id)} className="text-slate-300 hover:text-rose-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" value={destSearch} onChange={e => setDestSearch(e.target.value)} placeholder="Search destinations..."
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400" />
                  {destSearch && <button type="button" onClick={() => setDestSearch('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {(() => {
                    const same = filteredDests.filter(d => d.region === primaryDest?.region);
                    const other = filteredDests.filter(d => d.region !== primaryDest?.region);
                    const row = (d: Destination) => (
                      <label key={d.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${additionalIds.includes(d.id) ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={additionalIds.includes(d.id)} onChange={() => toggleAdditional(d.id)} className="rounded border-slate-300 text-emerald-600" />
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-sm font-medium text-slate-700">{d.name}</span>
                        <span className="ml-auto text-xs text-slate-400">{d.region}</span>
                      </label>
                    );
                    return (
                      <>
                        {same.length > 0 && <><div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-100"><span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Same region · {primaryDest?.region}</span></div>{same.map(row)}</>}
                        {other.length > 0 && <>{same.length > 0 && <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100"><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Other regions</span></div>}{other.map(row)}</>}
                        {filteredDests.length === 0 && <p className="text-xs text-slate-400 text-center py-6">Select a primary destination first</p>}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: ITINERARY ═══════════════════ */}
        {activeTab === 'Itinerary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Day-by-Day Itinerary</p>
                <p className="text-xs text-slate-400 mt-0.5">Add each day with its schedule of activities</p>
              </div>
              <button type="button" onClick={addDay}
                className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>

            {itinerary.length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm">No itinerary yet. Click "Add Day" to start building your tour schedule.</p>
              </div>
            )}

            {itinerary.map((day, dayIdx) => (
              <div key={dayIdx} className="border border-slate-200 rounded-2xl overflow-hidden">
                {/* Day header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0">{day.day}</div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input type="text" value={day.title} onChange={e => updateDay(dayIdx, { title: e.target.value })}
                      placeholder="Day title (e.g. Baku → Sheki)"
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-400" />
                    <input type="text" value={day.summary} onChange={e => updateDay(dayIdx, { summary: e.target.value })}
                      placeholder="Short summary"
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setOpenDay(openDay === dayIdx ? null : dayIdx)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                      {openDay === dayIdx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>
                    <button type="button" onClick={() => removeDay(dayIdx)}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors text-slate-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Activities — table layout */}
                {openDay === dayIdx && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500" style={{width:90}}>Time</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500" style={{width:'25%'}}>Activity</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500" style={{width:148}}>Category</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500">Description</th>
                          <th style={{width:36}} />
                        </tr>
                      </thead>
                      <tbody>
                        {day.activities.map((act, actIdx) => {
                          return (
                            <tr key={actIdx} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-1.5">
                                <input type="time" value={act.time}
                                  onChange={e => updateActivity(dayIdx, actIdx, { time: e.target.value })}
                                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm outline-none font-mono focus:border-emerald-400 bg-white" />
                              </td>
                              <td className="px-3 py-1.5">
                                <input type="text" value={act.title}
                                  onChange={e => updateActivity(dayIdx, actIdx, { title: e.target.value })}
                                  placeholder="Activity name"
                                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-emerald-400 bg-white font-medium text-slate-700" />
                              </td>
                              <td className="px-3 py-1.5">
                                <CategoryPicker
                                  value={act.category}
                                  onChange={v => updateActivity(dayIdx, actIdx, { category: v })}
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input type="text" value={act.desc}
                                  onChange={e => updateActivity(dayIdx, actIdx, { desc: e.target.value })}
                                  placeholder="Brief description..."
                                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-emerald-400 bg-white text-slate-500" />
                              </td>
                              <td className="px-2 py-2">
                                <button type="button" onClick={() => removeActivity(dayIdx, actIdx)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="px-4 pb-4 pt-2">
                      <button type="button" onClick={() => addActivity(dayIdx)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
                        <Plus className="w-4 h-4" /> Add Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════ TAB: WHAT'S INCLUDED ═══════════════════ */}
        {activeTab === "What's Included" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                  Included in Tour
                </h2>
                <TagInput items={inclusions.included}
                  onChange={v => setInclusions(i => ({ ...i, included: v }))}
                  placeholder="e.g. Hotel (3 nights), then Enter" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-rose-500 flex items-center gap-2">
                  <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">✗</span>
                  Not Included
                </h2>
                <TagInput items={inclusions.excluded}
                  onChange={v => setInclusions(i => ({ ...i, excluded: v }))}
                  placeholder="e.g. Lunch & Dinner, then Enter" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">Tour Highlights</h2>
              <p className="text-xs text-slate-400">Short feature tags shown at the top of the tour page</p>
              <TagInput items={highlights} onChange={setHighlights} placeholder="e.g. UNESCO Sites, Small Groups, then Enter" />
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: FAQ & EXTRAS ═══════════════════ */}
        {activeTab === 'FAQ & Extras' && (
          <div className="space-y-6">
            {/* FAQ */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Frequently Asked Questions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Common questions and answers about this tour</p>
                </div>
                <button type="button" onClick={addFaq}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              {faq.length === 0 && (
                <div className="border-2 border-dashed border-slate-100 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-400">No FAQs yet. Add common questions about this tour.</p>
                </div>
              )}
              <div className="space-y-3">
                {faq.map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={item.q} onChange={e => updateFaq(i, { q: e.target.value })}
                          placeholder="Question (e.g. Can children join?)"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 font-medium" />
                        <textarea value={item.a} onChange={e => updateFaq(i, { a: e.target.value })}
                          rows={2} placeholder="Answer..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none text-slate-600" />
                      </div>
                      <button type="button" onClick={() => removeFaq(i)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0 mt-0.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing List */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">Packing List</h2>
              <p className="text-xs text-slate-400">Suggested items for travelers to bring</p>
              <TagInput items={packingList} onChange={setPackingList}
                placeholder="e.g. 👟 Hiking shoes, then Enter" />
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
