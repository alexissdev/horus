import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'
import { getErrorMessage } from '../lib/error'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword({ token, newPassword })
      navigate('/login', { state: { message: 'Contraseña restablecida. Iniciá sesión.' } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva contraseña</h1>

        {!token && (
          <p className="text-red-600 text-sm">Enlace inválido o expirado.</p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              maxLength={100}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>

        <Link to="/login" className="mt-4 block text-center text-sm text-indigo-600 hover:underline">
          Volver al login
        </Link>
      </div>
    </div>
  )
}
