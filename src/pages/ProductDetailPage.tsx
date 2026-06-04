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
      setTimeout(() => setAddedMsg(''), 2000)
    } catch (err) {
      setAddedMsg(getErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500 text-sm">Cargando...</div>
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8 text-red-500 text-sm">{getErrorMessage(error)}</div>
  if (!product) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline mb-6 block">
        ← Volver
      </button>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="md:flex">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="md:w-80 w-full h-64 md:h-auto object-cover" />
          ) : (
            <div className="md:w-80 w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}

          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                {product.category && (
                  <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {product.category.name}
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold text-indigo-600 whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{product.description}</p>

            <p className="mt-4 text-sm text-gray-500">
              Stock: <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </span>
            </p>

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-medium border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {adding ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>
            )}

            {addedMsg && (
              <p className={`mt-3 text-sm font-medium ${addedMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>
                {addedMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
