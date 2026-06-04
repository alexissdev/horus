import { NavLink, Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

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
      <Navbar />
      <div className="glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-5 h-10 flex items-center gap-6">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Admin</span>
          <div className="w-px h-3.5 bg-white/10" />
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-xs transition-colors ${isActive ? 'text-violet-400 font-medium' : 'text-white/45 hover:text-white'}`
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
