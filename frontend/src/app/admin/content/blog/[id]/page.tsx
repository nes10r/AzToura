'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Travel Tips', 'Culture', 'Food', 'Adventure', 'History', 'Photography', 'Events'];

export default function BlogFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    category: 'Travel Tips', tags: '', published: false, featured: false,
    metaTitle: '', metaDescription: '',
  });

  useEffect(() => {
    if (!isNew) {
      adminService.getBlogPostById(id).then(r => {
        const b = r.data;
        setForm({
          title: b.title || '', slug: b.slug || '', excerpt: b.excerpt || '',
          content: b.content || '', coverImage: b.coverImage || '',
          category: b.category || 'Travel Tips', tags: (b.tags || []).join(', '),
          published: b.published || false, featured: b.featured || false,
          metaTitle: b.metaTitle || '', metaDescription: b.metaDescription || '',
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const autoSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (isNew) await adminService.createBlogPost(body);
      else await adminService.updateBlogPost(id, body);
      router.push('/admin/content/blog');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/content/blog" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Add New Post' : 'Edit Blog Post'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isNew ? 'Create a new blog article' : `Editing post ID: ${id.slice(0, 8)}`}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Post Content</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
            <input type="text" value={form.title} required
              onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="10 Hidden Gems in Baku"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <input type="text" value={form.slug} onChange={f('slug')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
            <textarea value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="Short summary shown in cards"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Content *</label>
            <textarea value={form.content} onChange={f('content')} rows={12} required
              placeholder="Write your article content here. Markdown is supported."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none font-mono" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Categorization</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select value={form.category} onChange={f('category')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={f('tags')} placeholder="baku, culture, food"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Title</label>
            <input type="text" value={form.metaTitle} onChange={f('metaTitle')}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
            <textarea value={form.metaDescription} onChange={f('metaDescription')} rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Media</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
            <input type="url" value={form.coverImage} onChange={f('coverImage')} placeholder="https://..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-slate-200"
                onError={e => (e.currentTarget.style.display = 'none')} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">Publishing</h2>
          {([['published', 'Published', 'Live on the site'], ['featured', 'Featured', 'Show in featured sections']] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
              <button type="button" onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? 'Publish Post' : 'Save Changes'}
          </button>
          <Link href="/admin/content/blog" className="px-6 py-2.5 border border-slate-200 text-sm rounded-xl hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
