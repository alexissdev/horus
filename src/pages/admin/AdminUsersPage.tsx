import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '../../api/admin'
import { getErrorMessage } from '../../lib/error'
import { Pagination } from '../../components/Pagination'

export function AdminUsersPage() {
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminUsersApi.list({ page }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'USER' | 'ADMIN' }) =>
      adminUsersApi.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: (err) => alert(getErrorMessage(err)),
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Usuarios</h1>

      {isLoading && <p className="text-gray-500 text-sm">Cargando...</p>}

      {data && (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Email verificado</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.content.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.emailVerified ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          roleMutation.mutate({ id: user.id, role: e.target.value as 'USER' | 'ADMIN' })
                        }
                        disabled={roleMutation.isPending}
                        className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
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
