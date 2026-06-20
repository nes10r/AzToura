'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Destination } from '@/types';

const COLUMNS: Column<Destination>[] = [
  {
    key: 'name', label: 'Destination', sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.coverImage ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
            <img src={row.coverImage.startsWith('/') ? row.coverImage : row.coverImage} alt={row.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
        )}
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">/{row.slug}</p>
        </div>
      </div>
    ),
  },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'city',   label: 'City',   sortable: true },
  {
    key: 'featured', label: 'Featured',
    render: row => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {row.featured ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    key: 'createdAt', label: 'Created', sortable: true,
    render: row => <span className="text-slate-400 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
];

export default function AdminDestinationsPage() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getDestinations({ limit: '100' })
      .then(r => setData(r.data || []))
      .catch(err => console.error('Destinations load error:', err?.response?.data || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Destination) => {
    await adminService.deleteDestination(row.id);
    load();
  };

  return (
    <div className="space-y-4 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Destinations</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage Azerbaijan destinations</p>
      </div>
      <DataTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        searchPlaceholder="Search destinations..."
        addHref="/admin/content/destinations/new"
        addLabel="Add Destination"
        editHref={row => `/admin/content/destinations/${row.id}`}
        onDelete={handleDelete}
      />
    </div>
  );
}
