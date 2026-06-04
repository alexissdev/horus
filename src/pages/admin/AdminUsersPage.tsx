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
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="text-white/35 text-sm mt-1">{data?.totalElements ?? 0} usuarios</p>
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Email verificado</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">Rol</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">{user.name}</td>
                    <td className="px-5 py-3.5 text-white/50">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        user.emailVerified
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {user.emailVerified ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value as 'USER' | 'ADMIN' })}
                        disabled={roleMutation.isPending}
                        className="text-xs rounded-lg px-2 py-1 disabled:opacity-50 outline-none focus:ring-1 focus:ring-violet-500/50"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#c4b5fd' }}
                      >
                        <option value="USER" style={{ background: '#1a1a2e' }}>USER</option>
                        <option value="ADMIN" style={{ background: '#1a1a2e' }}>ADMIN</option>
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
