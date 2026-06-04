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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi perfil</h1>

      {user && !user.emailVerified && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          Tu email no está verificado. Revisá tu bandeja de entrada para verificarlo.
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl p-6">
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{user?.email}</p>
        </div>
        <div className="mb-6 pb-4 border-b">
          <p className="text-sm text-gray-500">Rol</p>
          <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={50}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              maxLength={100}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Dejar vacío para no cambiar"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
