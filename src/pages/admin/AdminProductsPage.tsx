import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../../api/products'
import { categoriesApi } from '../../api/categories'
import { formatPrice } from '../../lib/format'
import { getErrorMessage } from '../../lib/error'
import { Pagination } from '../../components/Pagination'
import type { Product } from '../../types'

interface FormState {
  name: string; description: string; price: string; stock: string; imageUrl: string; categoryId: string
}
const emptyForm: FormState = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative w-full h-36 rounded-xl cursor-pointer overflow-hidden transition-all"
        style={{ border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' }}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span className="text-white text-xs font-medium">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-white/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs">Clic o arrastrá una imagen</span>
          </div>
        )}
      </div>

      {value && (
        <button type="button" onClick={() => { onChange(''); if (inputRef.current) inputRef.current.value = '' }}
          className="text-xs text-red-400/60 hover:text-red-400 transition-colors">
          Quitar imagen
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}

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
      setShowForm(false); setEditing(null); setForm(emptyForm)
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
    setForm({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock), imageUrl: p.imageUrl ?? '', categoryId: p.category ? String(p.category.id) : '' })
    setFormError(''); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError('')
    saveMutation.mutate({ name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl || undefined, categoryId: form.categoryId ? Number(form.categoryId) : undefined })
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-white/35 text-sm mt-1">{data?.totalElements ?? 0} productos</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #6c3bfa, #4f46e5)' }}>
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-2xl p-7 w-full max-w-lg shadow-2xl shadow-black/60 my-auto">
            <h2 className="text-lg font-bold text-white mb-5">
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            {formError && <p className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Imagen</label>
                <ImagePicker value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Nombre</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="glass-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required rows={3}
                  className="glass-input" style={{ resize: 'none' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Precio</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} required className="glass-input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Categoría</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="glass-input" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <option value="" style={{ background: '#1a1a2e' }}>Sin categoría</option>
                  {categoriesData?.content.map((c) => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Imagen</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Categoría</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-white/35 uppercase tracking-wider">Precio</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-white/35 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.content.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white/20 text-xs"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>—</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-white">{product.name}</td>
                    <td className="px-5 py-3 text-white/40">{product.category?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-white/70">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3 text-right text-white/70">{product.stock}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(product)} className="text-violet-400 hover:text-violet-300 text-xs mr-4 transition-colors">Editar</button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(product.id) }}
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
