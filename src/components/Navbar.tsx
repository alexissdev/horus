import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight text-white">
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Osiris
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
            Productos
          </Link>

          {user && (
            <>
              <Link to="/orders" className="text-sm text-white/60 hover:text-white transition-colors">
                Mis órdenes
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

              <Link to="/profile" className="text-sm text-white/60 hover:text-white transition-colors">
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-400/70 hover:text-red-400 transition-colors"
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
                className="text-sm px-4 py-1.5 rounded-xl font-medium text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
