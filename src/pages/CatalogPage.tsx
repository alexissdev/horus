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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Productos</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={categoryId ?? ''}
          onChange={(e) => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0) }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas las categorías</option>
          {categoriesData?.content.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Cargando...</p>}
      {error && <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>}

      {data && (
        <>
          {data.empty ? (
            <p className="text-gray-500 text-sm">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.content.map((product) => (
                <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/products/${product.id}`}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </Link>
                  <div className="p-3">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-900 text-sm hover:text-indigo-600 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.category && (
                      <p className="text-xs text-gray-400 mt-1">{product.category.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-indigo-600 text-sm">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingId === product.id || product.stock === 0}
                        className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
