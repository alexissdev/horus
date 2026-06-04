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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>

        {sent ? (
          <div className="mt-4">
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
              Si el email existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.
            </p>
            <Link to="/login" className="mt-4 block text-center text-sm text-indigo-600 hover:underline">
              Volver al login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            <Link to="/login" className="mt-4 block text-center text-sm text-indigo-600 hover:underline">
              Volver al login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
