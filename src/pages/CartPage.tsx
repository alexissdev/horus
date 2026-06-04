import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { ordersApi } from '../api/orders'
import { formatPrice } from '../lib/format'
import { getErrorMessage } from '../lib/error'

export function CartPage() {
  const { cart, updateItem, removeItem, clearCart } = useCartStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCheckout = async () => {
    setError('')
    setCheckingOut(true)
    try {
      const order = await ordersApi.checkout()
      await clearCart()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCheckingOut(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrito</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {cart.items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{item.productName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)} c/u</p>
            </div>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                className="px-2 py-1 hover:bg-gray-50 text-gray-700 text-sm"
              >
                −
              </button>
              <span className="px-3 py-1 text-sm font-medium border-x">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="px-2 py-1 hover:bg-gray-50 text-gray-700 text-sm"
              >
                +
              </button>
            </div>

            <span className="font-bold text-indigo-600 text-sm w-20 text-right">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-600 text-sm ml-2"
              aria-label="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-white border rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-sm">Total</span>
          <span className="text-xl font-bold text-indigo-600">{formatPrice(cart.total)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {checkingOut ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}
