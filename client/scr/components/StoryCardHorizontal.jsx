import React from "react";

export default function StoryCardHorizontal({ story, children, className }) {
  return (
    <div className={`flex gap-4 p-3 rounded-[10px] items-start max-w-full overflow-hidden ${className || ""}`}>
      <img
        className="w-[120px] h-[160px] object-cover rounded-md flex-none"
        src={story.coverImage}
        alt={story.title}
      />
      <div className="flex flex-col flex-auto h-full min-w-0 space-y-[6px]">
        {children}
      </div>
    </div>
  );
}