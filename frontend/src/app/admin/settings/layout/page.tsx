'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export default function LayoutSettingsPage() {
  const [settings, setSettings] = useState({
    stickyNavbar: true, mobileBottomNav: false, showSidebar: false,
    showSearch: true, showFavorites: true, darkModeToggle: false,
    breadcrumbs: true, backToTop: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => setSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Layout Settings</h1><p className="text-slate-500 text-sm mt-0.5">Control the site layout behavior</p></div>
        <button onClick={save} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Navigation</h2>
        <Toggle label="Sticky Navbar"       desc="Navbar stays at top when scrolling"  value={settings.stickyNavbar}     onChange={() => toggle('stickyNavbar')}     />
        <Toggle label="Mobile Bottom Nav"   desc="Show bottom nav bar on mobile"        value={settings.mobileBottomNav}  onChange={() => toggle('mobileBottomNav')}  />
        <Toggle label="Show Search Icon"    desc="Display search in header"             value={settings.showSearch}       onChange={() => toggle('showSearch')}       />
        <Toggle label="Show Favorites Icon" desc="Display favorites in header"          value={settings.showFavorites}    onChange={() => toggle('showFavorites')}    />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">UI Elements</h2>
        <Toggle label="Breadcrumbs"         desc="Show breadcrumb navigation on pages" value={settings.breadcrumbs}      onChange={() => toggle('breadcrumbs')}      />
        <Toggle label="Back to Top Button"  desc="Floating button to scroll to top"    value={settings.backToTop}        onChange={() => toggle('backToTop')}        />
        <Toggle label="Dark Mode Toggle"    desc="Allow users to switch dark mode"     value={settings.darkModeToggle}   onChange={() => toggle('darkModeToggle')}   />
      </div>
    </div>
  );
}
