import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,67,219,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(45,20,130,0.2) 0%, transparent 60%), #07071a',
    }}>
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
