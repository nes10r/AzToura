'use client';

import { useEffect, useState } from 'react';
import { settingsService, SiteSettings } from '@/services/settings';
import { Check, Globe, Mail, Phone, MapPin } from 'lucide-react';

function Field({ label, name, value, onChange, type = 'text', placeholder }: {
  label: string; name: string; value: string; onChange: (n: string, v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
      />
    </div>
  );
}

function Toggle({ label, desc, name, value, onChange }: {
  label: string; desc: string; name: string; value: boolean; onChange: (n: string, v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(name, !value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

const EMPTY: Partial<SiteSettings> = {
  siteName: '', siteSlogan: '', metaTitle: '', metaDescription: '',
  seoKeywords: '', contactEmail: '', contactPhone: '', contactAddress: '',
  socialFacebook: '', socialInstagram: '', socialTwitter: '', socialYoutube: '',
  defaultLanguage: 'en', defaultCurrency: 'USD',
  maintenanceMode: false, allowRegistration: true, allowReviews: true, allowBooking: true,
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSite()
      .then(r => setSettings(r.data || EMPTY))
      .finally(() => setLoading(false));
  }, []);

  const change = (name: string, value: string) => setSettings(p => ({ ...p, [name]: value }));
  const toggle = (name: string, value: boolean) => setSettings(p => ({ ...p, [name]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await settingsService.updateSite(settings);
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Site Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your site identity and global settings</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-60"
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-500" /> General
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Site Name"  name="siteName"  value={settings.siteName || ''} onChange={change} placeholder="AzTour" />
          <Field label="Slogan"     name="siteSlogan" value={settings.siteSlogan || ''} onChange={change} placeholder="Land of Fire" />
          <Field label="Logo URL"   name="logoUrl"   value={settings.logoUrl || ''} onChange={change} placeholder="https://..." />
          <Field label="Favicon URL" name="faviconUrl" value={settings.faviconUrl || ''} onChange={change} placeholder="https://..." />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Language</label>
            <select
              value={settings.defaultLanguage || 'en'}
              onChange={e => change('defaultLanguage', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white"
            >
              <option value="en">English</option>
              <option value="az">Azerbaijani</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">SEO</h2>
        <div className="space-y-4">
          <Field label="Meta Title"       name="metaTitle"       value={settings.metaTitle || ''}       onChange={change} placeholder="AzTour — Land of Fire" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
            <textarea
              value={settings.metaDescription || ''}
              onChange={e => change('metaDescription', e.target.value)}
              placeholder="Discover Azerbaijan's stunning destinations..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none"
            />
          </div>
          <Field label="SEO Keywords" name="seoKeywords" value={settings.seoKeywords || ''} onChange={change} placeholder="azerbaijan, tourism, baku, travel" />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-500" /> Contact Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Contact Email"   name="contactEmail"   value={settings.contactEmail || ''}   onChange={change} type="email" placeholder="hello@aztour.az" />
          <Field label="Contact Phone"   name="contactPhone"   value={settings.contactPhone || ''}   onChange={change} placeholder="+994 70 282 82 01" />
          <div className="sm:col-span-2">
            <Field label="Address" name="contactAddress" value={settings.contactAddress || ''} onChange={change} placeholder="28 May Street, Baku AZ1000" />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Facebook"  name="socialFacebook"  value={settings.socialFacebook || ''}  onChange={change} placeholder="https://facebook.com/..." />
          <Field label="Instagram" name="socialInstagram" value={settings.socialInstagram || ''} onChange={change} placeholder="https://instagram.com/..." />
          <Field label="Twitter/X" name="socialTwitter"   value={settings.socialTwitter || ''}   onChange={change} placeholder="https://twitter.com/..." />
          <Field label="YouTube"   name="socialYoutube"   value={settings.socialYoutube || ''}   onChange={change} placeholder="https://youtube.com/..." />
        </div>
      </div>

      {/* System toggles */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">System Flags</h2>
        <Toggle label="Maintenance Mode"     desc="Take site offline for visitors"     name="maintenanceMode"   value={!!settings.maintenanceMode}   onChange={toggle} />
        <Toggle label="Allow Registration"   desc="New users can sign up"              name="allowRegistration" value={!!settings.allowRegistration} onChange={toggle} />
        <Toggle label="Allow Reviews"        desc="Authenticated users can add reviews" name="allowReviews"     value={!!settings.allowReviews}     onChange={toggle} />
        <Toggle label="Allow Bookings"       desc="Booking functionality is enabled"   name="allowBooking"      value={!!settings.allowBooking}      onChange={toggle} />
      </div>
    </div>
  );
}
