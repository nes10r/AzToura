'use client';

import { useEffect, useRef, useState } from 'react';
import { settingsService, MediaFile } from '@/services/settings';
import { Upload, Trash2, Copy, ImageIcon, Search, FolderOpen, Link2, X, Check, Loader2 } from 'lucide-react';

const FOLDERS = ['general', 'destinations', 'tours', 'hotels', 'restaurants', 'events', 'blog'];

type AddMode = 'upload' | 'url' | null;

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('general');
  const [search, setSearch] = useState('');
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    settingsService.getMedia(folder, search).then(r => setFiles(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [folder]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      for (const file of Array.from(fileList)) {
        await settingsService.uploadMedia(file, folder);
      }
      setAddMode(null);
      load();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Upload failed';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const addUrl = async () => {
    if (!newUrl || !newName) return;
    setUploading(true);
    try {
      await settingsService.createMedia({ url: newUrl, name: newName, folder });
      setNewUrl(''); setNewName(''); setAddMode(null);
      load();
    } finally { setUploading(false); }
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
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage images and files</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddMode(addMode === 'url' ? null : 'url')}
            className="flex items-center gap-1.5 text-sm px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            <Link2 className="w-4 h-4" /> Add URL
          </button>
          <button
            onClick={() => { setAddMode('upload'); setTimeout(() => fileInput.current?.click(), 50); }}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload File
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* URL add form */}
      {addMode === 'url' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Add File by URL</h2>
            <button onClick={() => setAddMode(null)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">File Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="baku-night.jpg"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
              <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addUrl} disabled={uploading || !newUrl || !newName}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-60">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save
            </button>
            <button onClick={() => setAddMode(null)}
              className="px-4 py-2 border border-slate-200 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          <span className="text-sm text-emerald-700 font-medium">Uploading...</span>
        </div>
      )}
      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-rose-700">{uploadError}</span>
          <button onClick={() => setUploadError('')}><X className="w-4 h-4 text-rose-400" /></button>
        </div>
      )}

      <div
        className={`bg-white rounded-xl border-2 transition-colors ${dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        {/* Folder tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-slate-100">
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
              onKeyDown={e => e.key === 'Enter' && load()}
              placeholder="Search files..."
              className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-40" />
          </div>
        </div>

        {dragOver && (
          <div className="py-10 text-center">
            <Upload className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-emerald-700 font-medium">Drop images here to upload</p>
          </div>
        )}

        {!dragOver && (
          loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-16 text-center text-slate-400 cursor-pointer"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No files in this folder</p>
              <p className="text-sm mt-1">Click or drag & drop to upload images</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-5">
              {/* Upload tile */}
              <div
                onClick={() => fileInput.current?.click()}
                className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Upload</span>
              </div>

              {filtered.map(f => (
                <div key={f.id}
                  className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 transition-colors">
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => copyUrl(f.url)}
                      className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                      title={copied === f.url ? 'Copied!' : 'Copy URL'}>
                      {copied === f.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => remove(f.id)}
                      className="p-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{f.name}</p>
                    {f.size && <p className="text-white/60 text-xs">{(f.size / 1024).toFixed(0)} KB</p>}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} file{filtered.length !== 1 ? 's' : ''} in {folder}
          {dragOver ? '' : ' — drag & drop or click Upload to add images'}
        </div>
      </div>
    </div>
  );
}
