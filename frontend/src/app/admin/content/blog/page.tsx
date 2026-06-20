'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

const COLUMNS: Column<BlogPost>[] = [
  { key: 'title', label: 'Title', sortable: true, render: row => <div><p className="font-medium text-slate-800">{row.title}</p><p className="text-xs text-slate-400">/{row.slug}</p></div> },
  { key: 'author', label: 'Author', render: row => <span className="text-slate-500 text-sm">{(row as any).author?.name ?? '—'}</span> },
  { key: 'published', label: 'Status', render: row => <span className={`text-xs px-2 py-0.5 rounded-full ${row.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{row.published ? 'Published' : 'Draft'}</span> },
  { key: 'createdAt', label: 'Created', sortable: true, render: row => <span className="text-slate-400 text-xs">{formatDate(row.createdAt)}</span> },
];

export default function AdminBlogPage() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getBlogPosts({ limit: '100' }).then(r => setData(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1><p className="text-slate-500 text-sm mt-0.5">Manage travel guides and articles</p></div>
      <DataTable data={data} columns={COLUMNS} loading={loading} searchPlaceholder="Search posts..."
        addHref="/admin/content/blog/new" addLabel="New Post"
        editHref={row => `/admin/content/blog/${row.id}`}
        onDelete={async row => { await adminService.deleteBlogPost(row.id); load(); }} />
    </div>
  );
}
