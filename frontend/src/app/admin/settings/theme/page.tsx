'use client';

import { useEffect, useState } from 'react';
import { settingsService, ThemeSettings } from '@/services/settings';
import { Check, RotateCcw, Eye } from 'lucide-react';

const DEFAULTS: Omit<ThemeSettings, 'id' | 'updatedAt'> = {
  primaryColor: '#0A8F6A', secondaryColor: '#0F4C81', accentColor: '#F6B73C',
  bgColor: '#F8FAFC', textColor: '#1E293B', cardColor: '#FFFFFF',
  borderColor: '#E2E8F0', headerColor: '#0F4C81', footerColor: '#1E293B',
  fontFamily: 'Geist', headingFont: 'Geist', fontSize: '16',
  lineHeight: '1.6', borderRadius: '8', buttonStyle: 'rounded', cardStyle: 'shadow',
};

function ColorField({ label, name, value, onChange }: {
  label: string; name: string; value: string; onChange: (n: string, v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className="w-24 text-xs border border-slate-200 rounded-lg px-2 py-1.5 font-mono outline-none focus:border-emerald-400"
        />
        <div className="relative w-9 h-9 rounded-lg border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors">
          <input
            type="color"
            value={value}
            onChange={e => onChange(name, e.target.value)}
            className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ background: value }} />
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: {
  label: string; name: string; value: string;
  onChange: (n: string, v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <select
        value={value}
        onChange={e => onChange(name, e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-400 bg-white"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function RangeField({ label, name, value, onChange, min, max, unit }: {
  label: string; name: string; value: string;
  onChange: (n: string, v: string) => void;
  min: number; max: number; unit?: string;
}) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span className="text-sm font-mono text-slate-500">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(name, e.target.value)}
        className="w-full accent-emerald-600"
      />
    </div>
  );
}

export default function ThemeSettingsPage() {
  const [theme, setTheme] = useState<Partial<ThemeSettings>>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    settingsService.getTheme()
      .then(r => setTheme(r.data || DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  const change = (name: string, value: string) => {
    setTheme(prev => ({ ...prev, [name]: value }));
  };

  const applyPreview = () => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary',    theme.primaryColor || '');
    root.style.setProperty('--color-secondary',  theme.secondaryColor || '');
    root.style.setProperty('--color-accent',     theme.accentColor || '');
    root.style.setProperty('--color-background', theme.bgColor || '');
    root.style.setProperty('--color-text',       theme.textColor || '');
    root.style.setProperty('--color-card',       theme.cardColor || '');
    root.style.setProperty('--color-border',     theme.borderColor || '');
    setPreview(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await settingsService.updateTheme(theme);
      applyPreview();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Theme Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Customize the visual appearance of your site</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(DEFAULTS)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={applyPreview}
            className="flex items-center gap-1.5 text-sm px-3 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-60"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-1">Colors</h2>
          <p className="text-xs text-slate-400 mb-4">Brand and UI colors applied across the site</p>
          <ColorField label="Primary Color"   name="primaryColor"   value={theme.primaryColor   || '#0A8F6A'} onChange={change} />
          <ColorField label="Secondary Color" name="secondaryColor" value={theme.secondaryColor || '#0F4C81'} onChange={change} />
          <ColorField label="Accent Color"    name="accentColor"    value={theme.accentColor    || '#F6B73C'} onChange={change} />
          <ColorField label="Background"      name="bgColor"        value={theme.bgColor        || '#F8FAFC'} onChange={change} />
          <ColorField label="Text Color"      name="textColor"      value={theme.textColor      || '#1E293B'} onChange={change} />
          <ColorField label="Card Color"      name="cardColor"      value={theme.cardColor      || '#FFFFFF'} onChange={change} />
          <ColorField label="Border Color"    name="borderColor"    value={theme.borderColor    || '#E2E8F0'} onChange={change} />
          <ColorField label="Header Color"    name="headerColor"    value={theme.headerColor    || '#0F4C81'} onChange={change} />
          <ColorField label="Footer Color"    name="footerColor"    value={theme.footerColor    || '#1E293B'} onChange={change} />
        </div>

        {/* Typography + Spacing */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-1">Typography</h2>
            <p className="text-xs text-slate-400 mb-4">Fonts and text sizing</p>
            <SelectField label="Font Family" name="fontFamily" value={theme.fontFamily || 'Geist'} onChange={change}
              options={[
                { label: 'Geist', value: 'Geist' },
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Open Sans', value: 'Open Sans' },
                { label: 'Poppins', value: 'Poppins' },
              ]}
            />
            <RangeField label="Base Font Size" name="fontSize" value={theme.fontSize || '16'} onChange={change} min={12} max={20} unit="px" />
            <RangeField label="Line Height"    name="lineHeight" value={theme.lineHeight || '1.6'} onChange={change} min={1} max={2} unit="" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-1">Shapes & Style</h2>
            <p className="text-xs text-slate-400 mb-4">Border radius and component styles</p>
            <RangeField label="Border Radius" name="borderRadius" value={theme.borderRadius || '8'} onChange={change} min={0} max={24} unit="px" />
            <SelectField label="Button Style" name="buttonStyle" value={theme.buttonStyle || 'rounded'} onChange={change}
              options={[
                { label: 'Rounded', value: 'rounded' },
                { label: 'Pill', value: 'pill' },
                { label: 'Square', value: 'square' },
              ]}
            />
            <SelectField label="Card Style" name="cardStyle" value={theme.cardStyle || 'shadow'} onChange={change}
              options={[
                { label: 'Shadow', value: 'shadow' },
                { label: 'Border', value: 'border' },
                { label: 'Flat', value: 'flat' },
              ]}
            />
          </div>

          {/* Custom CSS */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-1">Custom CSS</h2>
            <p className="text-xs text-slate-400 mb-3">Advanced: inject custom CSS into the site</p>
            <textarea
              value={theme.customCss || ''}
              onChange={e => change('customCss', e.target.value)}
              rows={6}
              placeholder="/* Your custom CSS here */&#10;.hero { ... }"
              className="w-full text-xs font-mono border border-slate-200 rounded-lg p-3 outline-none focus:border-emerald-400 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Component Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Buttons */}
          <div>
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Buttons</p>
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{ background: theme.primaryColor, borderRadius: (theme.borderRadius || '8') + 'px' }}>
                Primary Button
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                style={{ background: theme.secondaryColor, borderRadius: (theme.borderRadius || '8') + 'px' }}>
                Secondary Button
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                style={{ background: theme.accentColor, borderRadius: (theme.borderRadius || '8') + 'px' }}>
                Accent Button
              </button>
            </div>
          </div>

          {/* Card */}
          <div>
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Card</p>
            <div className="p-4 rounded-xl border"
              style={{
                background: theme.cardColor,
                borderColor: theme.borderColor,
                borderRadius: (theme.borderRadius || '8') + 'px',
                boxShadow: theme.cardStyle === 'shadow' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}>
              <p className="font-semibold text-sm mb-1" style={{ color: theme.textColor }}>Sample Card</p>
              <p className="text-xs" style={{ color: theme.textColor, opacity: 0.6 }}>Card content example</p>
              <button className="mt-3 text-xs px-3 py-1.5 font-medium text-white rounded-md"
                style={{ background: theme.primaryColor, borderRadius: (theme.borderRadius || '8') + 'px' }}>
                Action
              </button>
            </div>
          </div>

          {/* Typography */}
          <div>
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Typography</p>
            <div style={{ color: theme.textColor }}>
              <h3 className="text-lg font-bold mb-1">Heading Text</h3>
              <p className="text-sm mb-2" style={{ opacity: 0.7 }}>Body text sample for the site.</p>
              <a href="#" className="text-sm font-medium" style={{ color: theme.primaryColor }}>Link color</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
