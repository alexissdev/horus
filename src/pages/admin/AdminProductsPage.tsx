import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../../api/products'
import { categoriesApi } from '../../api/categories'
import { formatPrice } from '../../lib/format'
import { getErrorMessage } from '../../lib/error'
import { Pagination } from '../../components/Pagination'
import type { Product } from '../../types'

interface FormState {
  name: string
  description: string
  price: string
  stock: string
  imageUrl: string
  categoryId: string
}

const emptyForm: FormState = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

export function AdminProductsPage() {
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => productsApi.list({ page, size: 20 }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list({ size: 100 }),
  })

  const saveMutation = useMutation({
    mutationFn: (payload: Parameters<typeof productsApi.create>[0]) =>
      editing ? productsApi.update(editing.id, payload) : productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setShowForm(true) }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      imageUrl: p.imageUrl ?? '',
      categoryId: p.category ? String(p.category.id) : '',
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    saveMutation.mutate({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl || undefined,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            {formError && (
              <p className="mb-3 text-red-500 text-sm">{formError}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              {(['name', 'description', 'imageUrl'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field === 'imageUrl' ? 'URL de imagen' : field === 'name' ? 'Nombre' : 'Descripción'}
                  </label>
                  {field === 'description' ? (
                    <textarea
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      required={field !== 'imageUrl'}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      required={field === 'name'}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sin categoría</option>
                  {categoriesData?.content.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <p className="text-gray-500 text-sm">Cargando...</p>}

      {data && (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.content.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-right">{product.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(product)} className="text-indigo-600 hover:underline mr-3">Editar</button>
                      <button
                        onClick={() => { if (confirm('¿Eliminar este producto?')) deleteMutation.mutate(product.id) }}
                        className="text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
