interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
      >
        Siguiente
      </button>
    </div>
  )
}
