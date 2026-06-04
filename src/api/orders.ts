import { api } from './client'
import type { Order, Page, OrderStatus } from '../types'

export const ordersApi = {
  checkout: () =>
    api.post<Order>('/orders/checkout').then((r) => r.data),

  list: (params = {}) =>
    api.get<Page<Order>>('/orders', { params: { page: 0, size: 10, sort: 'createdAt,desc', ...params } }).then((r) => r.data),

  get: (id: number) =>
    api.get<Order>(`/orders/${id}`).then((r) => r.data),

  cancel: (id: number) =>
    api.delete<Order>(`/orders/${id}/cancel`).then((r) => r.data),
}

export const adminOrdersApi = {
  list: (params = {}) =>
    api.get<Page<Order>>('/admin/orders', { params: { page: 0, size: 20, sort: 'createdAt,desc', ...params } }).then((r) => r.data),

  updateStatus: (id: number, status: OrderStatus) =>
    api.put<Order>(`/admin/orders/${id}/status`, { status }).then((r) => r.data),
}
