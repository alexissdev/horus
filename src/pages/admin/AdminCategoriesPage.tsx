import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '../../api/categories'
import { getErrorMessage } from '../../lib/error'
import { Pagination } from '../../components/Pagination'
import type { Category } from '../../types'

export function AdminCategoriesPage() {
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', page],
    queryFn: () => categoriesApi.list({ page, size: 20 }),
  })

  const saveMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      editing ? categoriesApi.update(editing.id, payload) : categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  })

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setFormError(''); setShowForm(true) }

  const openEdit = (c: Category) => {
    setEditing(c)
    setName(c.name)
    setDescription(c.description ?? '')
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    saveMutation.mutate({ name, description: description || undefined })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Nueva categoría
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            {formError && <p className="mb-3 text-red-500 text-sm">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                  <th className="px-4 py-3 text-left">Descripción</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.content.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.description ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(cat)} className="text-indigo-600 hover:underline mr-3">Editar</button>
                      <button
                        onClick={() => { if (confirm('¿Eliminar esta categoría?')) deleteMutation.mutate(cat.id) }}
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
