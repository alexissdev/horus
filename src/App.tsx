import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { useAuthStore } from './store/authStore'
import { useCartStore } from './store/cartStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

function AppInit() {
  const { fetchMe, user } = useAuthStore()
  const { fetchCart } = useCartStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      fetchMe()
    }
  }, [fetchMe])

  useEffect(() => {
    if (user) fetchCart()
  }, [user, fetchCart])

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInit />
    </QueryClientProvider>
  )
}
