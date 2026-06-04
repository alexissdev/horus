import { api } from './client'
import type { Product, Page } from '../types'

interface ProductsQuery {
  page?: number
  size?: number
  sort?: string
  search?: string
}

interface ProductPayload {
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  categoryId?: number
}

export const productsApi = {
  list: (params: ProductsQuery = {}) =>
    api.get<Page<Product>>('/products', { params: { page: 0, size: 20, ...params } }).then((r) => r.data),

  get: (id: number) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: ProductPayload) =>
    api.post<Product>('/products', data).then((r) => r.data),

  update: (id: number, data: ProductPayload) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`),
}
