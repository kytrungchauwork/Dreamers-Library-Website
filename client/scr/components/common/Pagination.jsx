import React from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Logic tạo danh sách số trang có dấu ...
  const getPageNumbers = () => {
    const delta = 2; // Số trang hiển thị bên cạnh trang hiện tại
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  const btnClass =
    "w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 mx-1 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors bg-white text-gray-600";
  const activeClass =
    "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white";
  const disabledClass = "opacity-50 cursor-not-allowed bg-gray-100";

  return (
    <div className="flex justify-center items-center mt-8 font-['Quicksand'] select-none">
      {/* Nút Về đầu (<<) */}
      <button
        className={`${btnClass} ${currentPage === 1 ? disabledClass : ""}`}
        onClick={() => currentPage > 1 && onPageChange(1)}
        disabled={currentPage === 1}
      >
        <MdKeyboardDoubleArrowLeft size={20} />
      </button>

      {/* Nút Trước (<) */}
      <button
        className={`${btnClass} ${currentPage === 1 ? disabledClass : ""}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft size={20} />
      </button>

      {/* Danh sách số trang */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={index} className="mx-2 text-gray-400">
              ...
            </span>
          );
        }
        return (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`${btnClass} ${page === currentPage ? activeClass : ""}`}
          >
            {page}
          </button>
        );
      })}

      {/* Nút Sau (>) */}
      <button
        className={`${btnClass} ${
          currentPage === totalPages ? disabledClass : ""
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        <MdKeyboardArrowRight size={20} />
      </button>

      {/* Nút Cuối (>>) */}
      <button
        className={`${btnClass} ${
          currentPage === totalPages ? disabledClass : ""
        }`}
        onClick={() => currentPage < totalPages && onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardDoubleArrowRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
