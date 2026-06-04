import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth'
import { getErrorMessage } from '../lib/error'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
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
          <h1 className="text-xl font-bold text-white mb-1">Recuperar contraseña</h1>

          {sent ? (
            <div className="mt-4">
              <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-sm">
                Si el email existe en nuestro sistema, te enviamos un enlace de reseteo.
              </p>
              <Link to="/login" className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Volver al login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-white/40 mb-6 mt-1">
                Ingresá tu email y te enviamos el enlace.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required placeholder="tu@email.com" className="glass-input" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>

              <Link to="/login" className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Volver al login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
