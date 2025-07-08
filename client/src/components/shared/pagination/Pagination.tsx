type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  textColor?: string;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  textColor,
}: TPaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];

    // first Page
    buttons.push(
      <button
        key={1}
        className={`px-3 py-1 border rounded ${
          currentPage === 1
            ? "bg-purple-700 text-white"
            : `bg-gray-100 ${textColor ?? ""} border border-purple-500`
        }`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // left ellipsis
    if (currentPage > 3) {
      buttons.push(
        <span key="left-ellipsis" className={`px-2 ${textColor ?? ""}`}>
          ...
        </span>
      );
    }

    // previous Page
    if (currentPage - 1 > 1) {
      buttons.push(
        <button
          key={currentPage - 1}
          className={`px-3 py-1 border rounded bg-gray-100 ${
            textColor ?? ""
          } border border-purple-500`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      );
    }

    // current page (only show if not 1 or totalPages — already handled above)
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

    // next Page
    if (currentPage + 1 < totalPages) {
      buttons.push(
        <button
          key={currentPage + 1}
          className={`px-3 py-1 border rounded bg-gray-100 ${
            textColor ?? ""
          } border border-purple-500`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      );
    }

    // right ellipsis
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="right-ellipsis" className={`px-2 ${textColor ?? ""}`}>
          ...
        </span>
      );
    }

    // Last Page (if not already rendered)
    if (totalPages !== 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-purple-700 text-white"
              : `bg-gray-100 ${textColor ?? ""} border border-purple-500`
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
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
