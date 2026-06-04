import { api } from './client'
import type { AuthTokens, User } from '../types'

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthTokens>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthTokens>('/auth/login', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  logoutAll: () =>
    api.post('/auth/logout-all'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),

  getMe: () =>
    api.get<User>('/users/me').then((r) => r.data),

  updateMe: (data: { name?: string; newPassword?: string }) =>
    api.put<User>('/users/me', data).then((r) => r.data),

  deleteMe: () =>
    api.delete('/users/me'),
}
