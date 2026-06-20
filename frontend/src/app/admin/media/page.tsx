'use client';

import { useEffect, useState } from 'react';
import { settingsService, MediaFile } from '@/services/settings';
import { Upload, Trash2, Copy, ImageIcon, Search, FolderOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const FOLDERS = ['general', 'destinations', 'tours', 'hotels', 'restaurants', 'events', 'blog'];

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('general');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [adding, setAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    settingsService.getMedia(folder).then(r => setFiles(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [folder]);

  const addFile = async () => {
    if (!newUrl || !newName) return;
    await settingsService.createMedia({ url: newUrl, name: newName, folder });
    setNewUrl(''); setNewName(''); setAdding(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    await settingsService.deleteMedia(id);
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Media Library</h1><p className="text-slate-500 text-sm mt-0.5">Manage images and files</p></div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          <Upload className="w-4 h-4" /> Add File
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-semibold text-slate-700">Add New File</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">File Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="baku-night.jpg"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">URL</label>
              <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addFile} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Save</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-slate-200 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-slate-100">
          {/* Folder tabs */}
          <div className="flex gap-1.5 overflow-x-auto">
            {FOLDERS.map(f => (
              <button key={f} onClick={() => setFolder(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${folder === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <FolderOpen className="w-3.5 h-3.5" /> {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 sm:ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-40" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No files in this folder</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-5">
            {filtered.map(f => (
              <div key={f.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 transition-colors">
                {f.url && (
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.opacity = '0')} />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(f.url)}
                    className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    title={copied === f.url ? 'Copied!' : 'Copy URL'}>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(f.id)}
                    className="p-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{f.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} file{filtered.length !== 1 ? 's' : ''} in {folder}
        </div>
      </div>
    </div>
  );
}
