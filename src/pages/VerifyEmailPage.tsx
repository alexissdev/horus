import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authApi.verifyEmail(token).then(() => setStatus('success')).catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,67,219,0.35) 0%, transparent 70%), #07071a',
    }}>
      <div className="glass-strong rounded-2xl p-10 w-full max-w-sm text-center shadow-2xl shadow-black/40">
        {status === 'loading' && (
          <p className="text-white/50 text-sm">Verificando email...</p>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h1 className="text-lg font-bold text-white mb-2">¡Email verificado!</h1>
            <p className="text-sm text-white/40 mb-5">Tu cuenta está activa.</p>
            <Link to="/login" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Ir al login →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✕
            </div>
            <h1 className="text-lg font-bold text-white mb-2">Enlace inválido</h1>
            <p className="text-sm text-white/40 mb-5">El enlace expiró o es inválido.</p>
            <Link to="/login" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Volver al login →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
