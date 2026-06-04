import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import { categoriesApi } from '../api/categories'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../lib/format'
import { getErrorMessage } from '../lib/error'
import { Pagination } from '../components/Pagination'

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [page, setPage] = useState(0)
  const [addingId, setAddingId] = useState<number | null>(null)
  const user = useAuthStore((s) => s.user)
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list({ size: 100 }),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', search, categoryId, page],
    queryFn: () => productsApi.list({ search: search || undefined, page }),
  })

  const handleAddToCart = async (productId: number) => {
    if (!user) { navigate('/login'); return }
    setAddingId(productId)
    try {
      await addItem(productId)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Productos</h1>
        <p className="text-white/40 text-sm mt-1">Explorá nuestro catálogo</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="glass-input flex-1"
        />
        <select
          value={categoryId ?? ''}
          onChange={(e) => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0) }}
          className="glass-input sm:w-52"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <option value="" style={{ background: '#1a1a2e' }}>Todas las categorías</option>
          {categoriesData?.content.map((c) => (
            <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{getErrorMessage(error)}</p>}

      {data && (
        <>
          {data.empty ? (
            <p className="text-white/40 text-sm">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.content.map((product) => (
                <div
                  key={product.id}
                  className="glass rounded-2xl overflow-hidden flex flex-col group transition-all hover:shadow-lg hover:shadow-violet-500/10"
                  style={{ transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Link to={`/products/${product.id}`} className="block">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-white/20 text-xs"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        Sin imagen
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-white text-sm leading-snug hover:text-violet-300 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.category && (
                      <span className="mt-1.5 text-[10px] font-medium text-violet-400/70 uppercase tracking-wider">
                        {product.category.name}
                      </span>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="font-bold text-white text-sm">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingId === product.id || product.stock === 0}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium text-white transition-all disabled:opacity-40"
                        style={{ background: product.stock === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}
                      >
                        {product.stock === 0 ? 'Sin stock' : addingId === product.id ? '...' : '+ Carrito'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
