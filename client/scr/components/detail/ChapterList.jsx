import React from "react";
import { Link } from "react-router-dom";
import { BsBookmarkFill } from "react-icons/bs";

const ChapterList = ({ chapters, storyId, markedChapterId }) => {
  return (
    <div className="mt-[40px] font-['Quicksand']">
      <h2 className="text-[22px] font-bold mb-[20px]">
        Danh sách chương ({chapters.length})
      </h2>

      <ul className="list-none p-0 m-0 border-t border-[#eee] max-h-[500px] overflow-y-auto">
        {chapters.map((chapter) => {
          const isBookmarked = chapter.id === markedChapterId;

          return (
            <li key={chapter.id}>
              <Link
                to={`/truyen/${storyId}/chuong/${chapter.id}`}
                className={`flex items-center justify-between py-[15px] border-b border-[#eee] no-underline transition-all duration-200 px-[10px] rounded-lg
                  ${
                    isBookmarked
                      ? "bg-orange-50 border-l-4 border-l-orange-500 text-orange-700 font-bold"
                      : "text-[#333] hover:text-[#007bff] hover:bg-gray-50"
                  }
                `}
              >
                <span>
                  Chương {chapter.chapter_number}: {chapter.title}
                </span>

                {isBookmarked && (
                  <span className="flex items-center gap-1 text-[12px] text-orange-500 shrink-0">
                    <BsBookmarkFill /> Đang đọc
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChapterList;