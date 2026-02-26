import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/button/Button";
import { FaTrashAlt } from "react-icons/fa";

const LibraryStoryCard = ({ story, onDelete }) => {
  // Thêm dấu ? vào story?.chapters để tránh lỗi nếu story không có chapters
  const firstChapterId =
    story?.chapters && story.chapters.length > 0 ? story.chapters[0].id : null;

  // Kiểm tra nếu story bị null/undefined thì không render gì cả
  if (!story) return null;

  const readLink = firstChapterId
    ? `/truyen/${story.id}/chuong/${firstChapterId}`
    : `/truyen/${story.id}`;

  // Fallback ảnh nếu không có ảnh
  const coverImage =
    story.coverImage ||
    story.cover_image ||
    "https://via.placeholder.com/220x330";

  return (
    <div className="flex flex-col w-[219px] bg-white border border-black rounded-none box-border p-0 pb-[10px]">
      <Link to={`/truyen/${story.id}`} state={{ from: "/library" }}>
        <img
          className="w-[219px] h-[321px] object-cover rounded-[10px]"
          src={coverImage}
          alt={story.title || "Truyện"}
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/220x330")
          }
        />
      </Link>

      <h3 className="font-['Quicksand'] font-bold text-[20px] text-[#181821] mt-[16px] mb-[6px] text-center whitespace-nowrap overflow-hidden text-ellipsis px-[10px]">
        {story.title}
      </h3>
      <p className="font-['Quicksand'] font-medium text-[18px] text-[#181821] mb-[16px] text-center">
        {story.author || "Đang cập nhật"}
      </p>

      <div className="flex justify-center items-center gap-[8px] px-[10px] mt-auto">
        <Button
          to={readLink}
          state={{ from: "/library" }}
          variant="primary"
          size="small"
          className="flex-1"
        >
          Đọc ngay
        </Button>

        <Button
          onClick={() => onDelete(story.id)}
          variant="danger"
          size="small"
          title="Xóa khỏi kho"
        >
          <FaTrashAlt />
        </Button>
      </div>
    </div>
  );
};

export default LibraryStoryCard;
