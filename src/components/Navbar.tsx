import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useBackendStatus } from '../hooks/useBackendStatus'

const STATUS_DOT: Record<string, string> = {
  checking: 'bg-yellow-400 opacity-70',
  online:   'bg-emerald-400',
  offline:  'bg-red-500',
}
const STATUS_LABEL: Record<string, string> = {
  checking: 'Conectando...',
  online:   'Backend online',
  offline:  'Backend sin conexión',
}

export function Navbar() {
  const { user, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount)
  const navigate = useNavigate()
  const backendStatus = useBackendStatus()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className="flex items-center gap-5 px-5 h-12 rounded-2xl shadow-lg shadow-black/30"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.11)',
        }}
      >
        <Link to="/" className="font-bold text-base tracking-tight mr-1">
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Osiris
          </span>
        </Link>

        <div className="w-px h-4 bg-white/10" />

        <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
          Productos
        </Link>

        {user && (
          <>
            <Link to="/orders" className="text-sm text-white/60 hover:text-white transition-colors">
              Órdenes
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin/products"
                className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Admin
              </Link>
            )}

            <Link to="/cart" className="relative text-sm text-white/60 hover:text-white transition-colors">
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-3.5 text-[10px] font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-violet-500/40">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <div className="w-px h-4 bg-white/10" />

            <Link to="/profile" className="text-sm text-white/60 hover:text-white transition-colors">
              {user.name}
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-400/60 hover:text-red-400 transition-colors"
            >
              Salir
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm px-3.5 py-1.5 rounded-xl font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
            >
              Registrarse
            </Link>
          </>
        )}

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-1.5 group cursor-default" title={STATUS_LABEL[backendStatus]}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[backendStatus]} ${backendStatus === 'checking' ? 'animate-pulse' : ''}`} />
          <span className="text-xs text-white/25 group-hover:text-white/50 transition-colors hidden sm:block">
            {STATUS_LABEL[backendStatus]}
          </span>
        </div>
      </nav>
    </div>
  )
}
