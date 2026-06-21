'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Check, User, Lock, Camera } from 'lucide-react';

interface Profile {
  id: string; name: string; email: string;
  avatar?: string; phone?: string; role: string; createdAt: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-colors';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setProfile(d.data);
          setName(d.data.name || '');
          setEmail(d.data.email || '');
          setPhone(d.data.phone || '');
          setAvatar(d.data.avatar || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, phone, avatar }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.message || 'Failed to save'); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(''); setPwSaved(false);
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const d = await res.json();
      if (!res.ok) { setPwError(d.message || 'Failed to update password'); return; }
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } finally { setPwSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="relative">
          {avatar ? (
            <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200" />
          ) : (
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A'}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-lg">{profile?.name}</p>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
            {profile?.role}
          </span>
        </div>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800">Personal Information</h2>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input className={INPUT} value={name} onChange={e => setName(e.target.value)} required />
            </Field>
            <Field label="Email Address">
              <input className={INPUT} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Field>
          </div>
          <Field label="Phone Number">
            <input className={INPUT} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+994 __ ___ __ __" />
          </Field>
          <Field label="Avatar URL">
            <input className={INPUT} value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." />
          </Field>

          {error && <p className="text-rose-500 text-sm">{error}</p>}

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors">
              {saved
                ? <><Check className="w-4 h-4" /> Saved!</>
                : saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><Save className="w-4 h-4" /> Save Changes</>
              }
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800">Change Password</h2>
        </div>
        <form onSubmit={savePassword} className="space-y-4">
          <Field label="Current Password">
            <input className={INPUT} type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New Password">
              <input className={INPUT} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8} />
            </Field>
            <Field label="Confirm New Password">
              <input className={INPUT} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
            </Field>
          </div>

          {pwError && <p className="text-rose-500 text-sm">{pwError}</p>}

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={pwSaving}
              className="flex items-center gap-2 px-5 py-2 bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors">
              {pwSaved
                ? <><Check className="w-4 h-4" /> Updated!</>
                : pwSaving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                  : <><Lock className="w-4 h-4" /> Update Password</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
