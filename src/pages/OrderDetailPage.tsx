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

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-8 text-gray-500 text-sm">Cargando...</div>
  if (error) return <div className="max-w-3xl mx-auto px-4 py-8 text-red-500 text-sm">{getErrorMessage(error)}</div>
  if (!order) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="text-sm text-indigo-600 hover:underline mb-6 block">
        ← Volver a mis órdenes
      </button>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Orden #{order.id}</h1>
            <p className="text-sm text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="divide-y border rounded-lg mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-400">x{item.quantity} · {formatPrice(item.productPrice)} c/u</p>
              </div>
              <span className="text-sm font-bold text-gray-700">
                {formatPrice(item.productPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">Total</span>
          <span className="text-xl font-bold text-indigo-600">{formatPrice(order.totalAmount)}</span>
        </div>

        {cancelMutation.error && (
          <p className="text-red-500 text-sm mb-4">{getErrorMessage(cancelMutation.error)}</p>
        )}

        {order.status === 'PENDING' && (
          <button
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar orden'}
          </button>
        )}
      </div>
    </div>
  )
}
