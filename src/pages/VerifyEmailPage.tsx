import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md text-center">
        {status === 'loading' && <p className="text-gray-500">Verificando email...</p>}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Email verificado!</h1>
            <p className="text-sm text-gray-500 mb-4">Tu cuenta está activa. Ya podés iniciar sesión.</p>
            <Link to="/login" className="text-indigo-600 hover:underline text-sm">
              Ir al login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Enlace inválido</h1>
            <p className="text-sm text-gray-500 mb-4">El enlace de verificación es inválido o ya expiró.</p>
            <Link to="/login" className="text-indigo-600 hover:underline text-sm">
              Volver al login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
