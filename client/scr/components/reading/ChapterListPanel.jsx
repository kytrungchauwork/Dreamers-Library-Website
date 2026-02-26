import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegEdit } from "react-icons/fa";
import { IoReorderThreeOutline } from "react-icons/io5";

const ChapterListPanel = ({ story, currentChapterId }) => {
  return (
    <aside className="w-[320px] shrink-0 border-l border-[#e0e0e0] flex flex-col bg-[#fdfdfd]">
      <div className="flex justify-around py-[15px] border-b border-[#e0e0e0]">
        <button className="bg-transparent border-none cursor-pointer p-[5px] text-[#007bff]">
          <IoReorderThreeOutline size={24} />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-[5px] text-[#888] hover:text-[#007bff] transition-colors">
          <FaBookmark size={18} />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-[5px] text-[#888] hover:text-[#007bff] transition-colors">
          <FaRegEdit size={18} />
        </button>
      </div>

      <ul className="list-none p-0 m-0 overflow-y-auto grow">
        {story.chapters.map(chapter => {
          let linkClasses = "block px-[20px] py-[12px] no-underline text-[14px] border-b border-[#f0f0f0] transition-all duration-200 leading-[1.5] last:border-none"
          
          if (chapter.id === currentChapterId)
            linkClasses += " text-[#007bff] font-bold bg-[#e6f7ff]"
          else
            linkClasses += " text-[#555] hover:bg-[#f5f5f5] hover:text-[#333]"

          return (
            <li key={chapter.id}>
              <Link
                to={`/truyen/${story.id}/chuong/${chapter.id}`}
                className={linkClasses}
              >
                {`Chương ${chapter.id}: ${chapter.title.substring(0, 35)}${chapter.title.length > 35 ? '...' : ''}`}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  );
};

export default ChapterListPanel;