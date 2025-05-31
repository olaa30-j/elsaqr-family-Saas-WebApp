import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '../../../../types/album';

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="flex justify-center items-center mt-8 gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft size={18} />
        السابق
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              {pageNum}
            </button>
          );
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="mx-1">...</span>
        )}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            {totalPages}
          </button>
        )}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        التالي
        <ChevronRight size={18} />
      </button>
    </div>
  );
};