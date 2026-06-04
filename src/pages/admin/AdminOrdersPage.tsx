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
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Órdenes</h1>
        <p className="text-white/35 text-sm mt-1">{data?.totalElements ?? 0} órdenes</p>
      </div>

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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Fecha</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-white/35 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">#{order.id}</td>
                    <td className="px-5 py-3.5 text-white/50">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-white/80">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        disabled={statusMutation.isPending}
                        className={`text-xs rounded-lg px-2 py-1 disabled:opacity-50 outline-none focus:ring-1 focus:ring-violet-500/50 ${ORDER_STATUS_COLOR[order.status]}`}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} style={{ background: '#1a1a2e' }}>{ORDER_STATUS_LABEL[s]}</option>
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
