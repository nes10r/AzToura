'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Restaurant } from '@/types';

const COLUMNS: Column<Restaurant>[] = [
  { key: 'name', label: 'Restaurant', sortable: true, render: row => <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-xs text-slate-400">{row.city}</p></div> },
  { key: 'cuisine', label: 'Cuisine', sortable: true },
  { key: 'priceRange', label: 'Price', render: row => <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{row.priceRange}</span> },
  { key: 'featured', label: 'Featured', render: row => <span className={`text-xs px-2 py-0.5 rounded-full ${row.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.featured ? 'Yes' : 'No'}</span> },
];

export default function AdminRestaurantsPage() {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getRestaurants({ limit: '100' }).then(r => setData(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Restaurants</h1><p className="text-slate-500 text-sm mt-0.5">Manage restaurant listings</p></div>
      <DataTable data={data} columns={COLUMNS} loading={loading} searchPlaceholder="Search restaurants..."
        addHref="/admin/content/restaurants/new" addLabel="Add Restaurant"
        editHref={row => `/admin/content/restaurants/${row.id}`}
        onDelete={async row => { await adminService.deleteRestaurant(row.id); load(); }} />
    </div>
  );
}
