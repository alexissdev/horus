import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../lib/format'
import { getErrorMessage } from '../lib/error'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.get(Number(id)),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (isLoading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
    </div>
  )
  if (error) return <p className="max-w-3xl mx-auto px-5 py-10 text-red-400 text-sm">{getErrorMessage(error)}</p>
  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <button onClick={() => navigate('/orders')} className="text-sm text-white/40 hover:text-white transition-colors mb-6 block">
        ← Mis órdenes
      </button>

      <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Orden #{order.id}</h1>
            <p className="text-xs text-white/35 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="glass rounded-xl divide-y divide-white/[0.06] mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="p-3.5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">{item.productName}</p>
                <p className="text-xs text-white/35 mt-0.5">x{item.quantity} · {formatPrice(item.productPrice)} c/u</p>
              </div>
              <span className="text-sm font-bold text-white/80">
                {formatPrice(item.productPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/[0.06]">
          <span className="text-white/50 text-sm">Total</span>
          <span className="text-xl font-bold text-white">{formatPrice(order.totalAmount)}</span>
        </div>

        {cancelMutation.error && (
          <p className="text-red-400 text-sm mb-4">{getErrorMessage(cancelMutation.error)}</p>
        )}

        {order.status === 'PENDING' && (
          <button
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-400/30 bg-red-500/10 hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar orden'}
          </button>
        )}
      </div>
    </div>
  )
}
