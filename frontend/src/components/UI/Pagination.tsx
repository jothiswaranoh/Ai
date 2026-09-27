import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemLabel = 'records',
  className = '',
}) => {
  if (totalItems <= 0 || totalPages <= 1) {
    if (totalItems > 0) {
      return (
        <div className={`flex items-center justify-between px-4 py-3 border-t border-stone-800 text-xs text-stone-400 ${className}`}>
          <span>
            Showing <strong className="text-white font-semibold">1</strong> to{' '}
            <strong className="text-white font-semibold">{totalItems}</strong> of{' '}
            <strong className="text-white font-semibold">{totalItems}</strong> {itemLabel}
          </span>
          <span className="text-stone-500 font-medium">Page 1 of 1</span>
        </div>
      );
    }
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-stone-800 bg-stone-950/60 select-none ${className}`}
    >
      {/* Range text */}
      <div className="text-xs text-stone-400">
        Showing <strong className="text-white font-semibold">{startItem}</strong> to{' '}
        <strong className="text-white font-semibold">{endItem}</strong> of{' '}
        <strong className="text-white font-semibold">{totalItems}</strong> {itemLabel}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 self-center sm:self-auto">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-800 text-xs font-medium text-stone-300 hover:bg-stone-800/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-stone-500 font-mono"
                >
                  …
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white border border-stone-800/80'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-800 text-xs font-medium text-stone-300 hover:bg-stone-800/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
