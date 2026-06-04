import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../lib/format'
import { getErrorMessage } from '../lib/error'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [addedMsg, setAddedMsg] = useState('')
  const user = useAuthStore((s) => s.user)
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(Number(id)),
    enabled: !!id,
  })

  const handleAddToCart = async () => {
    if (!product) return
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addItem(product.id, quantity)
      setAddedMsg('¡Agregado al carrito!')
      setTimeout(() => setAddedMsg(''), 2500)
    } catch (err) {
      setAddedMsg(getErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
    </div>
  )
  if (error) return <p className="max-w-4xl mx-auto px-5 py-10 text-red-400 text-sm">{getErrorMessage(error)}</p>
  if (!product) return null

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-white/40 hover:text-white transition-colors mb-6 block">
        ← Volver
      </button>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="md:flex">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="md:w-80 w-full h-64 md:h-auto object-cover" />
          ) : (
            <div className="md:w-80 w-full h-64 flex items-center justify-center text-white/20 text-sm"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              Sin imagen
            </div>
          )}

          <div className="p-8 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                {product.category && (
                  <span className="inline-block mt-2 text-[10px] font-semibold text-violet-400/80 uppercase tracking-widest">
                    {product.category.name}
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold text-white whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>

            <p className="mt-5 text-sm">
              Stock:{' '}
              <span className={product.stock > 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </span>
            </p>

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center glass rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-white/60 hover:text-white transition-colors text-lg font-light">
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-white border-x border-white/10">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-white/60 hover:text-white transition-colors text-lg font-light">
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-2.5 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
                >
                  {adding ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>
            )}

            {addedMsg && (
              <p className={`mt-3 text-sm font-medium ${addedMsg.includes('!') ? 'text-emerald-400' : 'text-red-400'}`}>
                {addedMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
