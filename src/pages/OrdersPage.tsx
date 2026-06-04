import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../lib/format'
import { Pagination } from '../components/Pagination'

export function OrdersPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => ordersApi.list({ page }),
  })

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Mis órdenes</h1>

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      )}

      {data?.empty && (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-white/40 text-sm">No tenés órdenes todavía.</p>
        </div>
      )}

      {data && !data.empty && (
        <>
          <div className="space-y-3">
            {data.content.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="glass flex items-center justify-between p-4 rounded-2xl hover:border-white/20 transition-all block"
                style={{ transition: 'border-color 0.15s, background 0.15s' }}
              >
                <div>
                  <p className="font-semibold text-white text-sm">Orden #{order.id}</p>
                  <p className="text-xs text-white/35 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <span className="font-bold text-white text-sm">{formatPrice(order.totalAmount)}</span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
