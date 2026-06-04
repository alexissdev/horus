import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'
import { getErrorMessage } from '../lib/error'

export function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const payload: { name?: string; newPassword?: string } = {}
      if (name !== user?.name) payload.name = name
      if (newPassword) payload.newPassword = newPassword

      const updated = await authApi.updateMe(payload)
      setUser(updated)
      setNewPassword('')
      setSuccess('Perfil actualizado correctamente.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Mi perfil</h1>

      {user && !user.emailVerified && (
        <div className="mb-5 p-3 rounded-xl text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20">
          Tu email no está verificado. Revisá tu bandeja de entrada.
        </div>
      )}

      {success && (
        <div className="mb-5 p-3 rounded-xl text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-5 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/30">
        <div className="mb-5 pb-5 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Email</p>
            <p className="font-medium text-white text-sm">{user?.email}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-500/15 text-violet-300 border border-violet-500/20">
            {user?.role}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              minLength={2} maxLength={50} required className="glass-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Nueva contraseña <span className="normal-case text-white/25">(opcional)</span>
            </label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              minLength={8} maxLength={100} placeholder="Dejar vacío para no cambiar"
              className="glass-input" />
          </div>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 mt-1"
            style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
