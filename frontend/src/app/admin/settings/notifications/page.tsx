'use client';

import { useState } from 'react';
import { Save, Check, Bell } from 'lucide-react';

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const [email, setEmail] = useState({ newBooking: true, bookingCancel: true, newUser: false, newReview: true, lowStock: false });
  const [adminEmail, setAdminEmail] = useState('nailmammadov@yahoo.com');
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof email) => setEmail(p => ({ ...p, [key]: !p[key] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Notification Settings</h1><p className="text-slate-500 text-sm mt-0.5">Configure admin email alerts</p></div>
        <button onClick={save} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h2 className="font-semibold text-slate-700">Admin Email</h2>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Send notifications to</label>
          <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-emerald-500" />
          <h2 className="font-semibold text-slate-700">Email Triggers</h2>
        </div>
        <Toggle label="New Booking"             desc="Get notified when a new booking is made"        value={email.newBooking}    onChange={() => toggle('newBooking')}    />
        <Toggle label="Booking Cancellation"    desc="Alert when a booking is cancelled by user"      value={email.bookingCancel} onChange={() => toggle('bookingCancel')} />
        <Toggle label="New User Registration"   desc="Alert when a new user registers"                value={email.newUser}       onChange={() => toggle('newUser')}       />
        <Toggle label="New Review Submitted"    desc="Notify when a user submits a review"            value={email.newReview}     onChange={() => toggle('newReview')}     />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>Note:</strong> Email delivery requires SMTP configuration. Set SMTP host, port and credentials in your server environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
      </div>
    </div>
  );
}
