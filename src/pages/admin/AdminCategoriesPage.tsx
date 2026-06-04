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
      setShowForm(false); setEditing(null)
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  })

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setFormError(''); setShowForm(true) }
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setDescription(c.description ?? ''); setFormError(''); setShowForm(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError('')
    saveMutation.mutate({ name, description: description || undefined })
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <p className="text-white/35 text-sm mt-1">{data?.totalElements ?? 0} categorías</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
          + Nueva categoría
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-2xl p-7 w-full max-w-md shadow-2xl shadow-black/60">
            <h2 className="text-lg font-bold text-white mb-5">
              {editing ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            {formError && <p className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="glass-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                  Descripción <span className="normal-case text-white/25">(opcional)</span>
                </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="glass-input" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saveMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
                  {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 glass hover:text-white transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      )}

      {data && (
        <>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Descripción</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.content.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">{cat.name}</td>
                    <td className="px-5 py-3.5 text-white/40">{cat.description ?? '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => openEdit(cat)} className="text-violet-400 hover:text-violet-300 text-xs mr-4 transition-colors">Editar</button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(cat.id) }}
                        className="text-red-400/60 hover:text-red-400 text-xs transition-colors">Eliminar</button>
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
