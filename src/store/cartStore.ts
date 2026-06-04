import { create } from 'zustand'
import type { Cart } from '../types'
import { cartApi } from '../api/cart'

interface CartState {
  cart: Cart | null
  itemCount: number
  fetchCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  setCart: (cart: Cart) => void
}

const countItems = (cart: Cart | null) =>
  cart?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  itemCount: 0,

  setCart: (cart) => set({ cart, itemCount: countItems(cart) }),

  fetchCart: async () => {
    const cart = await cartApi.get()
    set({ cart, itemCount: countItems(cart) })
  },

  addItem: async (productId, quantity = 1) => {
    const cart = await cartApi.addItem(productId, quantity)
    set({ cart, itemCount: countItems(cart) })
  },

  updateItem: async (itemId, quantity) => {
    const cart = await cartApi.updateItem(itemId, quantity)
    set({ cart, itemCount: countItems(cart) })
  },

  removeItem: async (itemId) => {
    const cart = await cartApi.removeItem(itemId)
    set({ cart, itemCount: countItems(cart) })
  },

  clearCart: async () => {
    const cart = await cartApi.clear()
    set({ cart, itemCount: 0 })
  },
}))
