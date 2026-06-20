'use client';

import { useState } from 'react';
import { GripVertical, Eye, EyeOff, Save, Check } from 'lucide-react';

const SECTIONS = [
  { id: 'hero',         label: 'Hero Section',           desc: 'Main banner with search',       enabled: true  },
  { id: 'categories',   label: 'Category Tiles',         desc: 'Browse by category',             enabled: true  },
  { id: 'destinations', label: 'Featured Destinations',  desc: 'Top destination cards',          enabled: true  },
  { id: 'tours',        label: 'Popular Tours',          desc: 'Highlighted tour packages',      enabled: true  },
  { id: 'hotels',       label: 'Hotels Section',         desc: 'Featured hotel listings',        enabled: false },
  { id: 'restaurants',  label: 'Restaurants Section',    desc: 'Popular dining options',         enabled: false },
  { id: 'events',       label: 'Upcoming Events',        desc: 'Events and festivals',           enabled: true  },
  { id: 'blog',         label: 'Blog Section',           desc: 'Latest travel guides',           enabled: false },
  { id: 'reviews',      label: 'Testimonials',           desc: 'User reviews and ratings',       enabled: true  },
  { id: 'stats',        label: 'Stats Strip',            desc: 'Numbers: users, destinations',  enabled: true  },
  { id: 'newsletter',   label: 'Newsletter Signup',      desc: 'Email subscription section',     enabled: false },
];

export default function HomeBuilderPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [heroTitle, setHeroTitle] = useState('Discover Azerbaijan');
  const [heroSubtitle, setHeroSubtitle] = useState('Find destinations, tours, hotels, restaurants and upcoming events');
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Home Page Builder</h1><p className="text-slate-500 text-sm mt-0.5">Control what appears on the home page</p></div>
        <button onClick={save} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      {/* Hero settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-700">Hero Content</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hero Title</label>
          <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hero Subtitle</label>
          <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}
            rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hero Background Image URL</label>
          <input type="text" defaultValue="/images/baku-night.jpg"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
        </div>
      </div>

      {/* Section order + visibility */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Page Sections</h2>
          <p className="text-xs text-slate-400 mt-0.5">Toggle visibility for each section</p>
        </div>
        <div className="divide-y divide-slate-100">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center gap-4 px-5 py-4">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 text-sm">{section.label}</p>
                <p className="text-xs text-slate-400">{section.desc}</p>
              </div>
              <button onClick={() => toggle(section.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${section.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {section.enabled ? 'Visible' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
