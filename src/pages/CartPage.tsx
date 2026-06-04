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
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="glass rounded-2xl p-12">
          <p className="text-white/40 text-base mb-4">Tu carrito está vacío</p>
          <Link to="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Explorar productos →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Carrito</h1>

      {error && (
        <div className="mb-5 p-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="glass rounded-2xl divide-y divide-white/[0.06] mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{item.productName}</p>
              <p className="text-xs text-white/40 mt-0.5">{formatPrice(item.price)} c/u</p>
            </div>

            <div className="flex items-center glass rounded-xl overflow-hidden">
              <button
                onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors"
              >
                −
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-white border-x border-white/10">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors"
              >
                +
              </button>
            </div>

            <span className="font-bold text-white text-sm w-20 text-right">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-white/25 hover:text-red-400 transition-colors text-sm ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between items-center mb-5">
          <span className="text-white/50 text-sm">Total</span>
          <span className="text-2xl font-bold text-white">{formatPrice(cart.total)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
        >
          {checkingOut ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}
