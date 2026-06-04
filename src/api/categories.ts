import { api } from './client'
import type { Category, Page } from '../types'

export const categoriesApi = {
  list: (params = {}) =>
    api.get<Page<Category>>('/categories', { params: { page: 0, size: 20, sort: 'name,asc', ...params } }).then((r) => r.data),

  get: (id: number) =>
    api.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  update: (id: number, data: { name: string; description?: string }) =>
    api.put<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`),
}
