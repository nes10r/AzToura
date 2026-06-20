'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Tour } from '@/types';

const COLUMNS: Column<Tour>[] = [
  {
    key: 'name', label: 'Tour', sortable: true,
    render: row => (
      <div>
        <p className="font-medium text-slate-800">{row.name}</p>
        <p className="text-xs text-slate-400">/{row.slug}</p>
      </div>
    ),
  },
  { key: 'price',    label: 'Price',    sortable: true, render: row => <span>${row.price}</span> },
  { key: 'duration', label: 'Duration', sortable: true, render: row => <span>{row.duration} days</span> },
  { key: 'maxGroupSize', label: 'Max People' },
  { key: 'featured', label: 'Featured', render: row => <span className={`text-xs px-2 py-0.5 rounded-full ${row.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.featured ? 'Yes' : 'No'}</span> },
];

export default function AdminToursPage() {
  const [data, setData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getTours({ limit: '100' }).then(r => setData(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tours</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage guided tours</p>
      </div>
      <DataTable
        data={data} columns={COLUMNS} loading={loading}
        searchPlaceholder="Search tours..."
        addHref="/admin/content/tours/new" addLabel="Add Tour"
        editHref={row => `/admin/content/tours/${row.id}`}
        onDelete={async row => { await adminService.deleteTour(row.id); load(); }}
      />
    </div>
  );
}
