import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/categories', label: 'Categorías' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/orders', label: 'Órdenes' },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-6">
          <span className="font-bold text-sm">Panel Admin</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm hover:text-indigo-200 ${isActive ? 'text-white font-medium' : 'text-indigo-200'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
