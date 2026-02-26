import { useEffect, useState } from "react";
// 1. Bỏ import JSON, thay bằng API
import { getAllStories, updateStory, deleteStory } from "@/services/storyAPI";
import Button from "@/components/button/Button.jsx";

/* ===== STATUS BADGE ===== */
// Hàm map trạng thái từ tiếng Anh (DB) sang tiếng Việt (Hiển thị)
const StatusBadge = ({ status }) => {
  const mapStyle = {
    completed: "bg-green-100 text-green-700",
    ongoing: "bg-yellow-100 text-yellow-700",
    stopped: "bg-gray-100 text-gray-600",
    hidden: "bg-red-100 text-red-700", // Trạng thái ẩn/chờ duyệt
  };

  const mapLabel = {
    completed: "Hoàn thành",
    ongoing: "Đang tiến hành",
    stopped: "Tạm ngưng",
    hidden: "Đang ẩn/Chờ duyệt",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        mapStyle[status] || "bg-gray-100"
      }`}
    >
      {mapLabel[status] || status}
    </span>
  );
};

/* ===== ACTION DROPDOWN ===== */
const ActionDropdown = ({ story, onApprove, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Hành động ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-20">
          {/* Chỉ hiện nút Duyệt nếu truyện đang bị ẩn */}
          {story.status === "hidden" && (
            <button
              onClick={() => {
                onApprove();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50"
            >
              Duyệt (Hiện)
            </button>
          )}

          {/* Nếu đang hiện thì cho phép Ẩn */}
          {story.status !== "hidden" && (
            <button
              onClick={() => {
                onApprove("hidden"); // Tái sử dụng hàm approve để set status hidden
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50"
            >
              Ẩn truyện
            </button>
          )}

          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Sửa
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

/* ===== STORY ROW ===== */
const StoryRow = ({ story, onApprove, onDelete, onEdit }) => (
  <tr className="border-t hover:bg-gray-50">
    <td
      className="px-4 py-3 truncate font-medium max-w-[200px]"
      title={story.title}
    >
      {story.title}
    </td>

    <td className="px-4 py-3 max-w-[150px] truncate">{story.author}</td>

    <td className="px-4 py-3 text-center">
      <StatusBadge status={story.status} />
    </td>

    <td className="px-4 py-3 text-center">⭐ {story.rating || 0}</td>

    <td className="px-4 py-3 text-center">
      {/* Backend chưa trả về chapters count trong getAllStories, tạm thời để 0 hoặc sửa backend sau */}
      --
    </td>

    <td className="px-4 py-3 text-center">
      <ActionDropdown
        story={story}
        onApprove={onApprove}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </td>
  </tr>
);

/* ===== MAIN ===== */
const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 2. Hàm fetch dữ liệu từ API
  const fetchStories = async () => {
    setLoading(true);
    try {
      // Gọi API lấy truyện, limit 10 truyện mỗi trang
      const res = await getAllStories({ limit: 10, page: page });
      if (res.data && res.data.success) {
        setStories(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách truyện:", error);
      alert("Không thể tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page]); // Chạy lại khi chuyển trang

  // 3. Hàm Duyệt / Ẩn truyện (Update Status)
  const handleUpdateStatus = async (id, newStatus = "ongoing") => {
    if (
      !window.confirm(
        `Bạn có chắc muốn chuyển trạng thái thành "${newStatus}"?`
      )
    )
      return;

    try {
      const res = await updateStory(id, { status: newStatus });
      if (res.data.success) {
        alert("Cập nhật trạng thái thành công!");
        fetchStories(); // Tải lại danh sách
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  // 4. Hàm Xóa truyện
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "CẢNH BÁO: Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?"
      )
    )
      return;

    try {
      const res = await deleteStory(id);
      if (res.data.success) {
        alert("Đã xóa truyện thành công.");
        fetchStories();
      }
    } catch (error) {
      console.error("Lỗi xóa truyện:", error);
      alert("Xóa thất bại.");
    }
  };

  // 5. Hàm Edit (Chưa có trang edit, tạm thời alert)
  const handleEdit = (id) => {
    // Sau này bạn sẽ navigate tới `/admin/stories/edit/${id}`
    alert(`Tính năng sửa truyện ID: ${id} đang phát triển`);
  };

  // Logic Search Client-side (Tạm thời)
  const filteredStories = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden p-2">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Quản lý truyện</h1>
          <p className="text-gray-500 mt-1">
            Quản lý danh sách truyện trong hệ thống
          </p>
        </div>
        <button
          onClick={fetchStories}
          className="text-sm text-blue-600 hover:underline"
        >
          Làm mới danh sách
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo tên truyện hoặc tác giả..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border rounded-lg px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* TABLE */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <table className="w-full text-left table-fixed">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-[25%]">Tên truyện</th>
                <th className="px-4 py-3 w-[20%]">Tác giả</th>
                <th className="px-4 py-3 w-[15%] text-center">Trạng thái</th>
                <th className="px-4 py-3 w-[10%] text-center">Đánh giá</th>
                <th className="px-4 py-3 w-[10%] text-center">Chương</th>
                <th className="px-4 py-3 w-[20%] text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <StoryRow
                    key={story.id}
                    story={story}
                    // Mặc định duyệt là chuyển sang 'ongoing'
                    onApprove={(status) =>
                      handleUpdateStatus(story.id, status || "ongoing")
                    }
                    onEdit={() => handleEdit(story.id)}
                    onDelete={() => handleDelete(story.id)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Không tìm thấy truyện nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-2 pb-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1">
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ManageStories;
