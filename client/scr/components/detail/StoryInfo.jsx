import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegHeart, FaHeart, FaShareAlt, FaFlag } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Button from "@/components/button/Button";
import { toggleLikeStory } from "@/services/libraryAPI";
import StarRating from "@/components/detail/StarRating";
import { getUserId, getStoryData, saveStoryData } from "@/utils/storage";
import CommentSection from "@/components/detail/CommentSection";
import { AuthContext } from "@/contexts/AuthContext";
import { useLibrary } from "@/contexts/libraryAPIContext";
import { useEffect } from "react";

const StoryInfo = ({ story, markedChapterId }) => {
  const STATUS_MAP = {
    ongoing: "Đang viết",
    completed: "Hoàn thành",
  };
  const stored = getStoryData(story.id);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isModerator = user?.role === "moderator";
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { reloadLibrary } = useLibrary();
  const { libraryStories } = useLibrary();
  useEffect(() => {
    const liked = libraryStories.some((s) => s.id === story.id);
    setIsLiked(liked);
  }, [libraryStories, story.id]);

  const handleToggleLike = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để thích truyện");
      return;
    }

    try {
      const res = await toggleLikeStory(story.id);

      if (res.data.success) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.totalLikes);
      }

      reloadLibrary();

    } catch (err) {
      console.error("Toggle like failed", err);
    }
  };
  const userId = getUserId();
  const hasBookmark =
    markedChapterId &&
    story.chapters?.some((c) => c.id === markedChapterId);
  
  const defaultRating = { totalStars: 0, voteCount: 0, userVotes: {} };
  const [ratingDetail, setRatingDetail] = useState({
    ...defaultRating,
    ...(stored?.ratingDetail || {}),
    userVotes: stored?.ratingDetail?.userVotes || {},
  });
  const [storyStatus, setStoryStatus] = useState(
    stored?.status || story.status || "visible"
  );
  const storedComments = stored?.comments || [];
  const [comments, setComments] = useState(storedComments);
  const userRating = ratingDetail.userVotes[userId] || null;

  //Report
  const [reports, setReports] = useState(stored?.reports || {});
  const hasReported = !!reports[userId];
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportNote, setReportNote] = useState("");

  const submitReport = () => {
    if (!reportReason) return;

    const newReports = {
      ...reports,
      [userId]: {
        reason: reportReason,
        note: reportNote,
        createdAt: new Date().toISOString(),
      },
    };

    setReports(newReports);
    saveStoryData(story.id, { reports: newReports });

    setShowReportModal(false);
    setReportReason("");
    setReportNote("");
  };

  const handleVote = (newStar) => {
    const userVotes = ratingDetail.userVotes || {};
    let { totalStars, voteCount } = ratingDetail;
    if (userVotes[userId]) {
      totalStars = totalStars - userVotes[userId] + newStar;
    } else {
      totalStars = totalStars + newStar;
      voteCount += 1;
    }
    const newRating = {
      totalStars,
      voteCount,
      userVotes: { ...userVotes, [userId]: newStar },
    };
    setRatingDetail(newRating);
    saveStoryData(story.id, { ratingDetail: newRating });
  };

  const handleAddComment = (comment) => {
    const newComments = [...comments, { ...comment, userId }];
    setComments(newComments);
    saveStoryData(story.id, { comments: newComments });
  };

  const handleDeleteComment = (commentId) => {
    const newComments = comments.filter((c) => c.id !== commentId);
    setComments(newComments);
    saveStoryData(story.id, { comments: newComments });
  };

  const handleHideComment = (commentId) => {
    const newComments = comments.map((c) =>
      c.id === commentId ? { ...c, hidden: true } : c
    );
    setComments(newComments);
    saveStoryData(story.id, { comments: newComments });
  };
  const handleRestoreComment = (commentId) => {
    const newComments = comments.map((c) =>
      c.id === commentId ? { ...c, hidden: false } : c
    );
    setComments(newComments);
    saveStoryData(story.id, { comments: newComments });
  };

  const handleHideStory = () => {
    setStoryStatus("hidden");
    saveStoryData(story.id, { status: "hidden" });
  };
  const handleShowStory = () => {
    setStoryStatus("visible");
    saveStoryData(story.id, { status: "visible" });
  };
  const handleGoBack = () => {
    navigate("/");
  };
  const handleReadNow = () => {
    if (!story.chapters || story.chapters.length === 0) return;

    const targetId = hasBookmark
      ? markedChapterId
      : story.chapters[0].id;

    navigate(`/truyen/${story.id}/chuong/${targetId}`);
  };
  const handleShare = async () => {
    const shareData = {
      title: story.title,
      text: `Đọc truyện "${story.title}" cực hay tại Book Online!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Đã sao chép liên kết!");
      } catch (err) {
        alert("Lỗi sao chép.");
      }
    }
  };

  const hasChapters = story.chapters && story.chapters.length > 0;

  return (
    <div className="font-['Quicksand'] text-[#333]">
      <div className="mb-[20px]">
        <Button
          variant="text"
          onClick={handleGoBack}
          className="!p-0 hover:text-blue-600"
        >
          <IoIosArrowBack size={20} className="mr-1" />
          <span>Trở về</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-[30px]">
        <div className="shrink-0 mx-auto md:mx-0">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-[220px] h-[330px] rounded-[8px] object-cover shadow-sm bg-gray-200"
          />
        </div>

        <div className="flex flex-col w-full">
          <h1 className="text-[28px] font-bold m-0 mb-[10px]">{story.title}</h1>

          {/* Moderator Controls */}
          {isModerator && (
            <div className="flex gap-3 mb-4">
              {storyStatus !== "hidden" ? (
                <button
                  onClick={handleHideStory}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Ẩn truyện
                </button>
              ) : (
                <button
                  onClick={handleShowStory}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mở lại truyện
                </button>
              )}
            </div>
          )}
          {storyStatus === "hidden" && (
            <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded">
              Truyện này đang bị ẩn bởi moderator.
            </div>
          )}

          <div className="mb-[20px]">
            <StarRating
              baseRating={story.rating}
              ratingDetail={ratingDetail}
              userRating={userRating}
              onVote={handleVote}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-[30px] gap-y-[15px] border-t border-b border-[#eee] py-[20px] mb-[20px]">
            <div>
              <span className="block text-[14px] text-[#888] mb-[5px]">
                Tác giả
              </span>
              <span className="text-[16px] font-medium">{story.author}</span>
            </div>
            <div>
              <span className="block text-[14px] text-[#888] mb-[5px]">
                Nguồn
              </span>
              <span className="text-[16px] font-medium">{story.source}</span>
            </div>
            <div>
              <span className="block text-[14px] text-[#888] mb-[5px]">
                Thể loại
              </span>
              <span className="flex flex-wrap gap-[8px]">
                {story.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-[#f0f0f0] px-[8px] py-[3px] rounded-[4px] text-[12px] text-[#555]"
                  >
                    {genre}
                  </span>
                ))}
              </span>
            </div>
            <div>
              <span className="block text-[14px] text-[#888] mb-[5px]">
                Tình trạng
              </span>
              <span className="text-[16px] font-medium">
                {STATUS_MAP[storyStatus]}
              </span>
            </div>
          </div>

          {/* BUTTON GROUP */}
          <div className="flex gap-[15px] mt-auto">
            {/* 🔥 Nút Đọc Thông Minh */}
            <Button
              variant="primary"
              onClick={handleReadNow}
              disabled={!hasChapters}
              className="!px-6"
            >
              {hasBookmark ? `Đọc tiếp ` : "Đọc ngay"}
            </Button>

            <Button
              variant="icon"
              onClick={handleToggleLike}
              title={isLiked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"}
            >
              {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </Button>

            <Button variant="icon" onClick={handleShare} title="Chia sẻ truyện">
              <FaShareAlt />
            </Button>

            {user && (
              <Button
                variant="icon"
                onClick={() => setShowReportModal(true)}
                disabled={hasReported}
                title={
                  hasReported ? "Bạn đã báo cáo truyện này" : "Báo cáo truyện"
                }
              >
                <FaFlag
                  className={hasReported ? "text-gray-400" : "text-orange-500"}
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[420px] rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Báo cáo truyện</h2>

            {/* Reason */}
            <div className="space-y-2 mb-4">
              {[
                "Nội dung không phù hợp",
                "Vi phạm bản quyền",
                "Ngôn từ phản cảm",
                "Spam / quảng cáo",
              ].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reportReason === r}
                    onChange={() => setReportReason(r)}
                  />
                  {r}
                </label>
              ))}
            </div>

            {/* Note */}
            <textarea
              placeholder="Mô tả thêm (không bắt buộc)"
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-orange-500"
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={submitReport}
                disabled={!reportReason}
                className="px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[30px] leading-[1.7] text-[16px]">
        <p>{story.description}</p>
      </div>

      <CommentSection
        comments={comments}
        onAdd={handleAddComment}
        onDelete={handleDeleteComment}
        onHide={handleHideComment}
        onRestore={handleRestoreComment}
      />
    </div>
  );
};

export default StoryInfo;
