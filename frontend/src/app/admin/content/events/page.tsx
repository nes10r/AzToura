'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';

const COLUMNS: Column<Event>[] = [
  { key: 'name', label: 'Event', sortable: true, render: row => <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-xs text-slate-400">{row.city}</p></div> },
  { key: 'startDate', label: 'Date', sortable: true, render: row => <span className="text-slate-500 text-xs">{formatDate(row.startDate)}</span> },
  { key: 'price', label: 'Price', render: row => <span>{row.price === 0 ? 'Free' : `$${row.price}`}</span> },
  { key: 'featured', label: 'Featured', render: row => <span className={`text-xs px-2 py-0.5 rounded-full ${row.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.featured ? 'Yes' : 'No'}</span> },
];

export default function AdminEventsPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getEvents({ limit: '100' }).then(r => setData(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Events</h1><p className="text-slate-500 text-sm mt-0.5">Manage events</p></div>
      <DataTable data={data} columns={COLUMNS} loading={loading} searchPlaceholder="Search events..."
        addHref="/admin/content/events/new" addLabel="Add Event"
        editHref={row => `/admin/content/events/${row.id}`}
        onDelete={async row => { await adminService.deleteEvent(row.id); load(); }} />
    </div>
  );
}
