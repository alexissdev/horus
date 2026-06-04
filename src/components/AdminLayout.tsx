import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/categories', label: 'Categorías' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/orders', label: 'Órdenes' },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,67,219,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(45,20,130,0.2) 0%, transparent 60%), #07071a',
    }}>
      <div className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Admin</span>
          <div className="w-px h-4 bg-white/10" />
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-violet-400 font-medium' : 'text-white/50 hover:text-white'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
