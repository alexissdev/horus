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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis órdenes</h1>

      {isLoading && <p className="text-gray-500 text-sm">Cargando...</p>}

      {data?.empty && <p className="text-gray-500 text-sm">No tenés órdenes todavía.</p>}

      {data && !data.empty && (
        <>
          <div className="space-y-3">
            {data.content.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Orden #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                    <span className="font-bold text-indigo-600 text-sm">{formatPrice(order.totalAmount)}</span>
                  </div>
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
