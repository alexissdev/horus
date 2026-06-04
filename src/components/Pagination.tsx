interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-3 justify-center mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-4 py-1.5 text-sm rounded-xl text-white/60 hover:text-white glass transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>
      <span className="text-sm text-white/40">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="px-4 py-1.5 text-sm rounded-xl text-white/60 hover:text-white glass transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
    </div>
  )
}
