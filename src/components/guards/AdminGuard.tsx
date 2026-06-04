import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return <div className="flex justify-center items-center h-64">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />

  return <>{children}</>
}
