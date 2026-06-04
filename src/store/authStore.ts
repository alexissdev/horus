import { create } from 'zustand'
import type { User } from '../types'
import { clearTokens, setTokens } from '../api/client'
import { authApi } from '../api/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    const tokens = await authApi.login({ email, password })
    setTokens(tokens)
    const user = await authApi.getMe()
    set({ user })
  },

  register: async (username, email, password) => {
    const tokens = await authApi.register({ username, email, password })
    setTokens(tokens)
    const user = await authApi.getMe()
    set({ user })
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken') ?? ''
    try {
      await authApi.logout(refreshToken)
    } catch {
      // blacklist best-effort
    }
    clearTokens()
    set({ user: null })
  },

  fetchMe: async () => {
    set({ isLoading: true })
    try {
      const user = await authApi.getMe()
      set({ user })
    } catch {
      set({ user: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))
