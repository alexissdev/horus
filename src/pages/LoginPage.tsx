import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { getErrorMessage } from '../lib/error'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const { fetchCart } = useCartStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      await fetchCart()
      navigate('/')
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Osiris
          </h1>
          <p className="text-white/40 text-sm mt-2">Iniciá sesión en tu cuenta</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="glass-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 text-sm text-center">
            <Link to="/forgot-password" className="text-violet-400/70 hover:text-violet-400 transition-colors text-xs">
              ¿Olvidaste tu contraseña?
            </Link>
            <span className="text-white/30 text-xs">
              ¿No tenés cuenta?{' '}
              <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
                Registrate
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
