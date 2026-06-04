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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Osiris
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Productos
          </Link>

          {user && (
            <>
              <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">
                Mis órdenes
              </Link>

              {user?.role === 'ADMIN' && (
                <Link to="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Admin
                </Link>
              )}

              <Link to="/cart" className="relative text-sm text-gray-600 hover:text-gray-900">
                Carrito
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Salir
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
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
