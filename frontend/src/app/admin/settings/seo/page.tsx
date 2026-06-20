'use client';

import { useState } from 'react';
import { Save, Check, Globe } from 'lucide-react';

const PAGES = [
  { name: 'Home', path: '/', title: 'Azerbaijan Tourism', desc: 'Discover Azerbaijan destinations', keywords: 'azerbaijan, tourism, baku' },
  { name: 'Destinations', path: '/destinations', title: 'Destinations', desc: 'Explore all destinations', keywords: 'destinations, places' },
  { name: 'Tours', path: '/tours', title: 'Tours', desc: 'Guided tour packages', keywords: 'tours, guided' },
  { name: 'Hotels', path: '/hotels', title: 'Hotels', desc: 'Book hotels in Azerbaijan', keywords: 'hotels, accommodation' },
  { name: 'About', path: '/about', title: 'About Us', desc: 'About Azerbaijan Tourism Platform', keywords: 'about, team' },
];

export default function SEOPage() {
  const [pages, setPages] = useState(PAGES);
  const [saved, setSaved] = useState(false);

  const update = (i: number, field: string, value: string) => {
    setPages(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">SEO Management</h1><p className="text-slate-500 text-sm mt-0.5">Manage meta tags and SEO for each page</p></div>
        <button onClick={save} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save All</>}
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
                <input type="text" value={page.title} onChange={e => update(i, 'title', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                <p className="text-xs text-slate-400 mt-1">{page.title.length}/60 chars</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Meta Description</label>
                <textarea value={page.desc} onChange={e => update(i, 'desc', e.target.value)}
                  rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none" />
                <p className="text-xs text-slate-400 mt-1">{page.desc.length}/160 chars</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Keywords</label>
                <input type="text" value={page.keywords} onChange={e => update(i, 'keywords', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
