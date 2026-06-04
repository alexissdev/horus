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
    if (newPassword !== confirm) { setError('Las contraseñas no coinciden'); return }
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,67,219,0.35) 0%, transparent 70%), #07071a',
    }}>
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-xl font-bold text-white mb-6">Nueva contraseña</h1>

          {!token && (
            <p className="text-red-400 text-sm mb-4">Enlace inválido o expirado.</p>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Nueva contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                minLength={8} required placeholder="••••••••" className="glass-input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Confirmar</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required placeholder="••••••••" className="glass-input" />
            </div>
            <button type="submit" disabled={loading || !token}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>

          <Link to="/login" className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
