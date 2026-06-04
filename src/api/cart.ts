import { api } from './client'
import type { Cart } from '../types'

export const cartApi = {
  get: () =>
    api.get<Cart>('/cart').then((r) => r.data),

  addItem: (productId: number, quantity: number) =>
    api.post<Cart>('/cart/items', { productId, quantity }).then((r) => r.data),

  updateItem: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }).then((r) => r.data),

  removeItem: (itemId: number) =>
    api.delete<Cart>(`/cart/items/${itemId}`).then((r) => r.data),

  clear: () =>
    api.delete<Cart>('/cart').then((r) => r.data),
}
