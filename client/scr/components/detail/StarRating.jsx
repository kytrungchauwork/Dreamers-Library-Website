import { useState } from "react";

/**
 * Props:
 * - baseRating: number
 * - ratingDetail
 * - userRating: number | null (số sao user đã vote)
 * - onVote: (stars) => void
 */
const StarRating = ({
  baseRating = 0,
  ratingDetail,
  userRating = null,
  onVote
}) => {
  const [hoverStar, setHoverStar] = useState(0);

  const hasVoteData = ratingDetail && ratingDetail.voteCount > 0;

  const average = hasVoteData
    ? ratingDetail.totalStars / ratingDetail.voteCount
    : baseRating;

  const displayRating = average.toFixed(1);

  return (
    <div className="flex flex-col gap-1 my-4">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active =
            star <= (hoverStar || userRating || Math.round(average));

          return (
            <span
              key={star}
              className={`
                text-3xl cursor-pointer select-none
                transition-transform duration-150
                ${active ? "text-yellow-400" : "text-gray-300"}
                hover:scale-110
              `}
              onMouseEnter={() => setHoverStar(star)}
              onMouseLeave={() => setHoverStar(0)}
              onClick={() => onVote(star)}
            >
              ★
            </span>
          );
        })}
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">
          {displayRating}
        </span>
        <span> / 5 </span>
        <span className="text-gray-500">
          ({ratingDetail?.voteCount || 0} lượt đánh giá)
        </span>
      </div>

      {userRating && (
        <p className="text-sm text-gray-500">
          Bạn đã đánh giá {userRating} sao (có thể thay đổi)
        </p>
      )}
    </div>
  );
};

export default StarRating;
