'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Heart, Star, Settings, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: MapPin },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then((res) => { if (res.data) setUser(res.data); })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-surface rounded-2xl border border-border p-6 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <h2 className="font-bold text-text">{user.name}</h2>
                <p className="text-sm text-text-muted mt-0.5">{user.email}</p>
                <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                  {user.role.toLowerCase()}
                </span>
              </div>
            </div>

            <nav className="bg-surface rounded-2xl border border-border overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-left border-b border-border last:border-0 ${
                    activeTab === tab.id
                      ? 'bg-primary/5 text-primary'
                      : 'text-text-secondary hover:text-text hover:bg-border/30'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-error hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text">Welcome back, {user.name.split(' ')[0]}!</h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Bookings', value: '0', icon: Calendar, color: 'text-primary bg-primary/10' },
                    { label: 'Favorites', value: '0', icon: Heart, color: 'text-error bg-red-50' },
                    { label: 'Reviews', value: '0', icon: Star, color: 'text-accent bg-accent/10' },
                    { label: 'Trips', value: '0', icon: MapPin, color: 'text-secondary bg-secondary/10' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface rounded-2xl border border-border p-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-bold text-text">{stat.value}</p>
                      <p className="text-sm text-text-muted mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-surface rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-text mb-3">Upcoming Bookings</h3>
                  <div className="text-center py-10 text-text-muted">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No upcoming bookings</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/tours')}>
                      Explore Tours
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-text mb-6">My Bookings</h2>
                <div className="bg-surface rounded-2xl border border-border p-6 text-center py-16">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-30" />
                  <p className="text-text-secondary">No bookings yet</p>
                  <Button className="mt-4" onClick={() => router.push('/tours')}>Explore Tours</Button>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-text mb-6">Favorites</h2>
                <div className="bg-surface rounded-2xl border border-border p-6 text-center py-16">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-30" />
                  <p className="text-text-secondary">No favorites saved yet</p>
                  <Button className="mt-4" onClick={() => router.push('/destinations')}>Discover Destinations</Button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-text mb-6">Account Settings</h2>
                <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
                    <input
                      defaultValue={user.name}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Email</label>
                    <input
                      defaultValue={user.email}
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Phone</label>
                    <input
                      defaultValue={user.phone || ''}
                      type="tel"
                      placeholder="+994 50 000 0000"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <Button size="lg">Save Changes</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
