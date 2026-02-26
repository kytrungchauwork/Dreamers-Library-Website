import React from "react";

const StoryCard = ({ story }) => {
  // Ưu tiên coverImage (đã map), nếu không có thì dùng cover_image (gốc từ DB)
  const imageSrc =
    story.coverImage ||
    story.cover_image ||
    "https://via.placeholder.com/220x330?text=No+Image";

  return (
    <div className="flex flex-col gap-[15px] w-full h-full bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#eee]">
      <img
        className="w-full h-[320px] object-cover"
        src={imageSrc}
        alt={story.title}
        onError={(e) => {
          if (e.target.src !== "https://placehold.co/220x330?text=Error") {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/220x330?text=Error"; // Dùng placehold.co ổn định hơn via.placeholder
          }
        }}
      />
      <div className="px-[10px] pb-[15px] flex flex-col grow">
        <h3 className="font-['Quicksand'] font-bold text-[18px] text-[#181821] text-center mb-[5px] line-clamp-2 min-h-[54px]">
          {story.title}
        </h3>
        <p className="font-['Quicksand'] font-medium text-[14px] text-[#666] text-center line-clamp-1">
          {story.author}
        </p>
      </div>
    </div>
  );
};

export default StoryCard;
