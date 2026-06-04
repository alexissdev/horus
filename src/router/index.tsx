import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { AdminLayout } from '../components/AdminLayout'
import { AuthGuard } from '../components/guards/AuthGuard'
import { AdminGuard } from '../components/guards/AdminGuard'
import { GuestGuard } from '../components/guards/GuestGuard'

import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { VerifyEmailPage } from '../pages/VerifyEmailPage'

import { CatalogPage } from '../pages/CatalogPage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { CartPage } from '../pages/CartPage'
import { OrdersPage } from '../pages/OrdersPage'
import { OrderDetailPage } from '../pages/OrderDetailPage'
import { ProfilePage } from '../pages/ProfilePage'

import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <GuestGuard><LoginPage /></GuestGuard>,
  },
  {
    path: '/register',
    element: <GuestGuard><RegisterPage /></GuestGuard>,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <CatalogPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
    ],
  },
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: '/cart', element: <CartPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  {
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: '/admin/products', element: <AdminProductsPage /> },
      { path: '/admin/categories', element: <AdminCategoriesPage /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/orders', element: <AdminOrdersPage /> },
    ],
  },
])
