'use client';

import { useEffect, useState } from 'react';
import { Save, Check, Globe, Loader2 } from 'lucide-react';

interface PageSeo {
  name: string;
  path: string;
  title: string;
  desc: string;
  keywords: string;
}

const DEFAULTS: PageSeo[] = [
  { name: 'Home',         path: '/',             title: 'Aztoura',        desc: 'Discover the beauty of Azerbaijan — destinations, tours, hotels and restaurants.',  keywords: 'azerbaijan, tourism, baku, aztoura' },
  { name: 'Destinations', path: '/destinations', title: 'Destinations',   desc: 'Explore all destinations across Azerbaijan.',                                       keywords: 'destinations, places, azerbaijan' },
  { name: 'Tours',        path: '/tours',        title: 'Tours',          desc: 'Guided tour packages across Azerbaijan.',                                            keywords: 'tours, guided, travel' },
  { name: 'Hotels',       path: '/hotels',       title: 'Hotels',         desc: 'Book hotels in Azerbaijan.',                                                         keywords: 'hotels, accommodation, baku' },
  { name: 'Restaurants',  path: '/restaurants',  title: 'Restaurants',    desc: 'Best restaurants and dining in Azerbaijan.',                                         keywords: 'restaurants, food, baku' },
  { name: 'Events',       path: '/events',       title: 'Events',         desc: 'Upcoming events and festivals in Azerbaijan.',                                       keywords: 'events, festivals, azerbaijan' },
  { name: 'About',        path: '/about',        title: 'About Aztoura',  desc: 'Learn about Aztoura and our mission.',                                               keywords: 'about, team, aztoura' },
];

export default function SEOPage() {
  const [pages, setPages] = useState<PageSeo[]>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/site')
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.pagesSeo) {
          try { setPages(JSON.parse(data.pagesSeo)); } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (i: number, field: keyof PageSeo, value: string) => {
    setPages(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pagesSeo: JSON.stringify(pages) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">SEO Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage meta tags and SEO for each page</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-60 transition-colors"
        >
          {saved
            ? <><Check className="w-4 h-4" /> Saved!</>
            : saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save All</>
          }
        </button>
      </div>

      <div className="space-y-4">
        {pages.map((page, i) => (
          <div key={page.path} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-emerald-500" />
              <h2 className="font-semibold text-slate-700">{page.name}</h2>
              <span className="text-xs text-slate-400 font-mono">{page.path}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={e => update(i, 'title', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                />
                <p className={`text-xs mt-1 ${page.title.length > 60 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {page.title.length}/60 chars
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Description</label>
                <textarea
                  value={page.desc}
                  onChange={e => update(i, 'desc', e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none"
                />
                <p className={`text-xs mt-1 ${page.desc.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {page.desc.length}/160 chars
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Keywords</label>
                <input
                  type="text"
                  value={page.keywords}
                  onChange={e => update(i, 'keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
