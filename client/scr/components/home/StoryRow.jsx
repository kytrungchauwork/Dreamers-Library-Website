import React from "react";
import { Link } from "react-router-dom";
import StoryCard from "../StoryCard";

// Thêm prop showViewAll (mặc định là true để không ảnh hưởng trang chủ)
const StoryRow = ({ title, stories, showViewAll = true }) => {
  return (
    <section className="mb-[40px]">
      <div className="flex justify-between items-center mb-[20px]">
        {/* Render title: hỗ trợ cả chuỗi text hoặc JSX (để thêm icon nếu cần) */}
        <div className="font-['Quicksand'] text-[24px] font-bold text-[#181821]">
          {title}
        </div>

        {/* Chỉ hiện nút Xem tất cả nếu showViewAll = true */}
        {showViewAll && (
          <Link
            to="/tat-ca"
            className="font-['Quicksand'] text-[16px] text-[#007bff] no-underline"
          >
            Xem tất cả
          </Link>
        )}
      </div>

      <div className="flex gap-[20px] overflow-x-auto pb-[15px]">
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/truyen/${story.id}`}
            className="no-underline text-inherit"
          >
            {/* Wrapper div để cố định chiều rộng card nếu muốn đều nhau */}
            <div className="w-[220px] shrink-0">
              <StoryCard story={story} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default StoryRow;
