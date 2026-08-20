import { useEffect, useState, FormEvent } from 'react'
import { cmsService } from '../../lib/services/cmsService'
import { CreativeTool } from '../../types/database'
import { DataTable, Column } from '../components/DataTable'
import { Plus, Edit, Trash2, Palette, X } from 'lucide-react'

export default function CreativeToolsCMSPage() {
  const [tools, setTools] = useState<CreativeTool[]>([])
  const [editingTool, setEditingTool] = useState<Partial<CreativeTool> | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const data = await cmsService.getCreativeTools()
    setTools(data)
  }

  const handleCreateNew = () => {
    setEditingTool({
      name: '',
      category: 'Graphic Design',
      icon: 'SiAdobephotoshop',
      proficiency_level: 90,
      is_featured: true,
      is_published: true,
      display_order: tools.length + 1,
    })
    setIsDrawerOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingTool?.name) return
    setSaving(true)
    try {
      await cmsService.saveCreativeTool(editingTool)
      setIsDrawerOpen(false)
      setEditingTool(null)
      await loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to save creative tool')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete creative tool?')) return
    await cmsService.deleteCreativeTool(id)
    setTools((prev) => prev.filter((t) => t.id !== id))
  }

  const columns: Column<CreativeTool>[] = [
    {
      header: 'Software Tool Name',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400 font-mono">{row.icon}</p>
        </div>
      ),
    },
    {
      header: 'Category & Level',
      accessor: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-700">{row.category}</span>
          <p className="text-[10px] font-mono text-pink-600 mt-0.5">{row.proficiency_level}% proficiency</p>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditingTool(row); setIsDrawerOpen(true) }} className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
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
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Creative Software Tools CMS</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage Photoshop, Illustrator, Premiere, After Effects, Figma, Blender badges.</p>
          </div>
        </div>
        <button onClick={handleCreateNew} className="admin-btn admin-btn-primary text-xs">
          <Plus className="w-4 h-4" /> Add Tool
        </button>
      </div>

      <DataTable columns={columns} data={tools} searchKey="name" onAddClick={handleCreateNew} addLabel="Add Tool" />

      {isDrawerOpen && editingTool && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="text-base font-bold text-slate-900">
                {editingTool.id ? 'Edit Tool' : 'New Tool'}
              </h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  value={editingTool.name || ''}
                  onChange={(e) => setEditingTool((prev) => ({ ...prev, name: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category (e.g. Graphic Design, Video Editing, Motion Graphics)
                </label>
                <input
                  type="text"
                  value={editingTool.category || ''}
                  onChange={(e) => setEditingTool((prev) => ({ ...prev, category: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Proficiency Level (0 - 100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingTool.proficiency_level || 90}
                  onChange={(e) => setEditingTool((prev) => ({ ...prev, proficiency_level: parseInt(e.target.value, 10) }))}
                  className="admin-input"
                />
              </div>

              <div className="pt-6 flex justify-end gap-2 border-t border-slate-200">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="admin-btn admin-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary text-xs">
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
