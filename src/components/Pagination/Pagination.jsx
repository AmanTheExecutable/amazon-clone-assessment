import './Pagination.scss';
import { useFilters } from '../../context/FilterContext';

export default function Pagination({ totalPages }) {
  const { filters, updateFilter } = useFilters();
  const currentPage = filters.page;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    updateFilter('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--nav"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="pagination__nav-long">Previous</span>
        <span className="pagination__nav-short">‹</span>
      </button>

      {getPageNumbers().map((page, idx) => (
        page === '...'
          ? <span key={`ellipsis-${idx}`} className="pagination__ellipsis">...</span>
          : <button
              key={page}
              className={`pagination__btn${currentPage === page ? ' pagination__btn--active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
      ))}

      <button
        className="pagination__btn pagination__btn--nav"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="pagination__nav-long">Next</span>
        <span className="pagination__nav-short">›</span>
      </button>
    </div>
  );
}
