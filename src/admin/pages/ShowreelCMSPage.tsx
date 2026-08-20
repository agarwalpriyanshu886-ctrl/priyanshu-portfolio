import { useEffect, useState, FormEvent } from 'react'
import { cmsService } from '../../lib/services/cmsService'
import { Showreel } from '../../types/database'
import { DataTable, Column } from '../components/DataTable'
import { Plus, Edit, Trash2, CheckCircle2, Film, X } from 'lucide-react'

export default function ShowreelCMSPage() {
  const [showreels, setShowreels] = useState<Showreel[]>([])
  const [editingReel, setEditingReel] = useState<Partial<Showreel> | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const data = await cmsService.getShowreels()
    setShowreels(data)
  }

  const handleCreateNew = () => {
    setEditingReel({
      title: '',
      category: 'Video Editing & Motion Graphics',
      description: '',
      video_source: 'YOUTUBE',
      video_url: 'https://',
      poster_image: '',
      is_featured: true,
      is_published: true,
      display_order: showreels.length + 1,
    })
    setIsDrawerOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingReel?.title || !editingReel?.video_url) return
    setSaving(true)
    try {
      await cmsService.saveShowreel(editingReel)
      setIsDrawerOpen(false)
      setEditingReel(null)
      await loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to save showreel')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete showreel entry?')) return
    await cmsService.deleteShowreel(id)
    setShowreels((prev) => prev.filter((s) => s.id !== id))
  }

  const columns: Column<Showreel>[] = [
    {
      header: 'Showreel Title & Category',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.title}</p>
          <p className="text-xs text-slate-500 font-mono">{row.category}</p>
        </div>
      ),
    },
    {
      header: 'Source & URL',
      accessor: (row) => (
        <div>
          <span className="admin-badge admin-badge-neutral">{row.video_source}</span>
          <p className="text-xs text-blue-600 font-mono truncate max-w-xs">{row.video_url}</p>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditingReel(row); setIsDrawerOpen(true) }} className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Showreels & Motion Studio CMS</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage video showreels, YouTube/Vimeo embeds, and video sources.</p>
          </div>
        </div>
        <button onClick={handleCreateNew} className="admin-btn admin-btn-primary text-xs">
          <Plus className="w-4 h-4" /> Add Showreel
        </button>
      </div>

      <DataTable columns={columns} data={showreels} searchKey="title" onAddClick={handleCreateNew} addLabel="Add Showreel" />

      {isDrawerOpen && editingReel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="text-base font-bold text-slate-900">
                {editingReel.id ? 'Edit Showreel' : 'New Showreel'}
              </h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingReel.title || ''}
                  onChange={(e) => setEditingReel((prev) => ({ ...prev, title: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Video Source
                </label>
                <select
                  value={editingReel.video_source || 'YOUTUBE'}
                  onChange={(e) => setEditingReel((prev) => ({ ...prev, video_source: e.target.value as any }))}
                  className="admin-input"
                >
                  <option value="YOUTUBE">YouTube Embed</option>
                  <option value="VIMEO">Vimeo Embed</option>
                  <option value="UPLOAD">Direct Upload / Storage URL</option>
                  <option value="URL">External CDN Video URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Video URL
                </label>
                <input
                  type="text"
                  value={editingReel.video_url || ''}
                  onChange={(e) => setEditingReel((prev) => ({ ...prev, video_url: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Poster Image URL
                </label>
                <input
                  type="text"
                  value={editingReel.poster_image || ''}
                  onChange={(e) => setEditingReel((prev) => ({ ...prev, poster_image: e.target.value }))}
                  className="admin-input"
                />
              </div>

              <div className="pt-6 flex justify-end gap-2 border-t border-slate-200">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="admin-btn admin-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary text-xs">
                  Save Showreel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
