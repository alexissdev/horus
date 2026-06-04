import { api } from './client'
import type { User, Page } from '../types'

export const adminUsersApi = {
  list: (params = {}) =>
    api.get<Page<User>>('/admin/users', { params: { page: 0, size: 20, sort: 'email,asc', ...params } }).then((r) => r.data),

  updateRole: (id: number, role: 'USER' | 'ADMIN') =>
    api.put<User>(`/admin/users/${id}/role`, { role }).then((r) => r.data),
}
