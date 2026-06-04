import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminOrdersApi } from '../../api/orders'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../../lib/format'
import { getErrorMessage } from '../../lib/error'
import { Pagination } from '../../components/Pagination'
import type { OrderStatus } from '../../types'

const STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export function AdminOrdersPage() {
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => adminOrdersApi.list({ page }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      adminOrdersApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
    onError: (err) => alert(getErrorMessage(err)),
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Órdenes</h1>

      {isLoading && <p className="text-gray-500 text-sm">Cargando...</p>}

      {data && (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.content.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          statusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })
                        }
                        disabled={statusMutation.isPending}
                        className={`border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${ORDER_STATUS_COLOR[order.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                        ))}
                      </select>
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
