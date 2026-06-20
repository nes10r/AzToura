'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Hotel } from '@/types';

const COLUMNS: Column<Hotel>[] = [
  { key: 'name', label: 'Hotel', sortable: true, render: row => <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-xs text-slate-400">{row.city}</p></div> },
  { key: 'stars', label: 'Stars', render: row => <span>{'★'.repeat(row.stars)}</span> },
  { key: 'pricePerNight', label: 'Price/Night', sortable: true, render: row => <span>${row.pricePerNight}</span> },
  { key: 'featured', label: 'Featured', render: row => <span className={`text-xs px-2 py-0.5 rounded-full ${row.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.featured ? 'Yes' : 'No'}</span> },
];

export default function AdminHotelsPage() {
  const [data, setData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getHotels({ limit: '100' }).then(r => setData(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Hotels</h1><p className="text-slate-500 text-sm mt-0.5">Manage hotel listings</p></div>
      <DataTable data={data} columns={COLUMNS} loading={loading} searchPlaceholder="Search hotels..."
        addHref="/admin/content/hotels/new" addLabel="Add Hotel"
        editHref={row => `/admin/content/hotels/${row.id}`}
        onDelete={async row => { await adminService.deleteHotel(row.id); load(); }} />
    </div>
  );
}
