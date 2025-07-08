type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: TPaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];

    // First page
    buttons.push(
      <button
        key={1}
        className={`px-3 py-1 border rounded ${
          currentPage === 1 ? "bg-purple-700 text-white" : "bg-gray-100"
        }`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // Left ellipsis
    if (currentPage > 3) {
      buttons.push(
        <span key="left-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Previous page
    if (currentPage > 2) {
      buttons.push(
        <button
          key={currentPage - 1}
          className="px-3 py-1 border rounded bg-gray-100"
          onClick={() => onPageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      );
    }

    // Current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      buttons.push(
        <button
          key={currentPage}
          className="px-3 py-1 border rounded bg-purple-700 text-white"
        >
          {currentPage}
        </button>
      );
    }

    // Next page
    if (currentPage < totalPages - 1) {
      buttons.push(
        <button
          key={currentPage + 1}
          className="px-3 py-1 border rounded bg-gray-100"
          onClick={() => onPageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      );
    }

    // Right ellipsis
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="right-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Last page
    if (totalPages > 1 && currentPage !== totalPages) {
      buttons.push(
        <button
          key={totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-purple-700 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Case when currentPage is last and not rendered yet
    if (currentPage === totalPages && currentPage !== 1) {
      buttons.push(
        <button
          key={"current"}
          className="px-3 py-1 border rounded bg-purple-700 text-white"
        >
          {currentPage}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex gap-2 justify-center mt-6">{renderPageButtons()}</div>
  );
};

export default Pagination;
