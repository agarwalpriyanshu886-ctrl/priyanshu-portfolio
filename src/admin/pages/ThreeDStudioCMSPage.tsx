import { useEffect, useState, FormEvent } from 'react'
import { cmsService } from '../../lib/services/cmsService'
import { ThreeDAsset, ThreeDScene, ThreeDSceneObject, ModeSettings } from '../../types/database'
import { Box, Layers, Play, Settings, Save, Plus, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function ThreeDStudioCMSPage() {
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'SCENES' | 'SETTINGS'>('SETTINGS')
  const [assets, setAssets] = useState<ThreeDAsset[]>([])
  const [scenes, setScenes] = useState<ThreeDScene[]>([])
  const [modeSettings, setModeSettings] = useState<ModeSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [aList, sList, mSettings] = await Promise.all([
      cmsService.getThreeDAssets(),
      cmsService.getThreeDScenes(),
      cmsService.getModeSettings(),
    ])
    setAssets(aList)
    setScenes(sList)
    setModeSettings(mSettings)
  }

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault()
    if (!modeSettings) return
    setSaving(true)
    try {
      await cmsService.saveModeSettings(modeSettings)
      setMsg('3D Studio & Intro settings saved successfully.')
      setTimeout(() => setMsg(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Failed to save 3D settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">3D Studio & Scene Manager</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control 3D opening intro, WebGL scene parameters, GLB/GLTF assets, and particle density.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-600" /> Three.js / R3F Engine
        </span>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'SETTINGS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" /> Intro & Dual Mode Settings
        </button>
        <button
          onClick={() => setActiveTab('ASSETS')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ASSETS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="w-4 h-4" /> 3D Assets Library ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab('SCENES')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'SCENES' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> 3D Scenes ({scenes.length})
        </button>
      </div>

      {activeTab === 'SETTINGS' && modeSettings && (
        <form onSubmit={handleSaveSettings} className="admin-card p-6 space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Default Landing Mode
            </label>
            <select
              value={modeSettings.default_mode || 'DEVELOPER'}
              onChange={(e) => setModeSettings((s) => (s ? { ...s, default_mode: e.target.value as any } : s))}
              className="admin-input"
            >
              <option value="DEVELOPER">Developer Mode (Default)</option>
              <option value="CREATIVE">Creative Mode</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              3D Intro Animation Frequency
            </label>
            <select
              value={modeSettings.intro_mode || 'FIRST_VISIT'}
              onChange={(e) => setModeSettings((s) => (s ? { ...s, intro_mode: e.target.value as any } : s))}
              className="admin-input"
            >
              <option value="FIRST_VISIT">First Visit Only (Recommended)</option>
              <option value="ALWAYS">Always Show Opening Intro</option>
              <option value="DISABLED">Disable Opening Intro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Portal Transition Speed (ms)
            </label>
            <input
              type="number"
              value={modeSettings.transition_duration_ms || 1000}
              onChange={(e) => setModeSettings((s) => (s ? { ...s, transition_duration_ms: parseInt(e.target.value, 10) } : s))}
              className="admin-input"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary text-xs">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save 3D Settings'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'ASSETS' && (
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3D GLB/GLTF Asset Storage</h3>
            <button className="admin-btn admin-btn-primary text-xs">
              <Plus className="w-4 h-4" /> Upload 3D Asset
            </button>
          </div>

          {assets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              No custom 3D model files uploaded yet. Procedural Three.js particle systems are currently rendering active 3D scenes.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {assets.map((ast) => (
                <div key={ast.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-900 text-sm">{ast.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{ast.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'SCENES' && (
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active 3D Scenes</h3>
            <button className="admin-btn admin-btn-primary text-xs">
              <Plus className="w-4 h-4" /> Create 3D Scene
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <span className="admin-badge admin-badge-success">DEVELOPER WORLD</span>
              <h4 className="font-bold text-slate-900 text-base">Neural Network & Code Particles</h4>
              <p className="text-xs text-slate-600">Active background scene rendering cyan & indigo graph nodes.</p>
            </div>
            <div className="p-5 rounded-xl border border-pink-200 bg-pink-50/50 space-y-2">
              <span className="admin-badge admin-badge-warning">CREATIVE WORLD</span>
              <h4 className="font-bold text-slate-900 text-base">Studio Lights & 3D Typography</h4>
              <p className="text-xs text-slate-600">Active background scene rendering floating "CREATE" & "DESIGN" typography.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
