import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const CommentSection = ({
  comments = [],
  onAdd,
  onDelete,
  onHide,
  onRestore
}) => {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);
  const isModerator = user?.role === "moderator";

  const handleSubmit = () => {
    if (!content.trim() || !user) return;

    onAdd({
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      hidden: false
    });

    setContent("");
  };

  return (
    <div className="mt-10 font-['Quicksand']">
      <h2 className="text-[22px] font-bold mb-5">
        Bình luận ({comments.length})
      </h2>

      {/* Form nhập comment */}
      <div className="mb-6 p-5 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "/avatars/default.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">
                {user.fullName || user.username}
              </span>
            </div>
          )}

          <textarea
            placeholder="Nhập nội dung bình luận..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500"
          />

          <div className="text-right">
            {!user ? (
              <p className="text-sm text-gray-500">
                Bạn cần đăng nhập để bình luận.
              </p>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Gửi bình luận
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách comment */}
      <div className="flex flex-col gap-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">
            Chưa có bình luận nào.
          </p>
        )}

        {comments.map((c) => {
          // User thường không thấy comment bị ẩn
          if (c.hidden && !isModerator) return null;

          return (
            <div
              key={c.id}
              className={`flex gap-4 p-5 rounded-lg ${
                c.hidden
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <img
                src={c.avatar || "/avatars/default.png"}
                alt={c.username}
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Nội dung */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">
                    {c.fullName || c.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>

                  {c.hidden && isModerator && (
                    <span className="text-xs text-orange-600 italic">
                      (Đã ẩn)
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed">
                  {c.content}
                </p>
              </div>

              {/* Hành động moderator */}
              {isModerator && (
                <div className="flex flex-col gap-2 text-sm">
                  {!c.hidden ? (
                    <button
                      onClick={() => onHide(c.id)}
                      className="text-orange-600 hover:underline"
                    >
                      Ẩn
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(c.id)}
                      className="text-green-600 hover:underline"
                    >
                      Mở lại
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
