import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null
  if (user) return <Navigate to="/" replace />

  return <>{children}</>
}
