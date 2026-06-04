export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string | null
  category: Category | null
}

export interface CartItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
}

export interface Cart {
  id: number
  items: CartItem[]
  total: number
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productPrice: number
  quantity: number
}

export interface Order {
  id: number
  status: OrderStatus
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ApiError {
  status: number
  message: string
  timestamp: string
  errors: string[]
}
