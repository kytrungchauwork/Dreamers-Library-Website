import { useEffect, useState } from "react";
import { getAllStories, updateStory } from "@/services/storyAPI";

/* ===== STATUS BADGE ===== */
const StatusBadge = ({ status }) => {
  const mapStyle = {
    visible: "bg-green-100 text-green-700",
    hidden: "bg-red-100 text-red-700",
  };

  const mapLabel = {
    visible: "Đang hiển thị",
    hidden: "Đang ẩn",
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
const ActionDropdown = ({ story, onHide, onShow, onClear }) => {
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
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-20">
          {story.status !== "hidden" ? (
            <button
              onClick={() => {
                onHide(story.id);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50"
            >
              Ẩn truyện
            </button>
          ) : (
            <button
              onClick={() => {
                onShow(story.id);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50"
            >
              Mở lại truyện
            </button>
          )}

          <button
            onClick={() => {
              onClear(story.id);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Bỏ qua báo cáo
          </button>
        </div>
      )}
    </div>
  );
};

/* ===== ROW ===== */
const ReportRow = ({ story, onHide, onShow, onClear }) => (
  <tr className="border-t hover:bg-gray-50">
    <td className="px-4 py-3 truncate font-medium max-w-[280px]">
      {story.title}
    </td>

    <td className="px-4 py-3 text-center">
      {story.reports.length}
    </td>

    <td className="px-4 py-3 text-center">
      <StatusBadge status={story.status} />
    </td>

    <td className="px-4 py-3 text-center">
      <ActionDropdown
        story={story}
        onHide={onHide}
        onShow={onShow}
        onClear={onClear}
      />
    </td>
  </tr>
);

/* ===== MAIN ===== */
const ModeratorReports = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReportedStories = async () => {
    setLoading(true);
    try {
      const res = await getAllStories();
      if (res.data?.success) {
        // Chỉ lấy story có report
        const reported = res.data.data.filter(
          (s) => s.reports && s.reports.length > 0
        );
        setStories(reported);
      }
    } catch (err) {
      console.error("Lỗi tải báo cáo:", err);
      alert("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedStories();
  }, []);

  const handleHide = async (id) => {
    await updateStory(id, { status: "hidden" });
    fetchReportedStories();
  };

  const handleShow = async (id) => {
    await updateStory(id, { status: "visible" });
    fetchReportedStories();
  };

  const handleClearReports = async (id) => {
    if (!window.confirm("Bỏ qua toàn bộ báo cáo cho truyện này?")) return;

    await updateStory(id, { reports: [] });
    fetchReportedStories();
  };

  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Quản lý báo cáo</h1>
        <p className="text-gray-500 mt-1">
          Các truyện bị người dùng báo cáo
        </p>
      </div>

      <input
        type="text"
        placeholder="Tìm theo tên truyện..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border rounded-lg px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 w-[40%]">Tên truyện</th>
                <th className="px-4 py-3 w-[20%] text-center">
                  Lượt báo cáo
                </th>
                <th className="px-4 py-3 w-[20%] text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-3 w-[20%] text-center">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((story) => (
                  <ReportRow
                    key={story.id}
                    story={story}
                    onHide={handleHide}
                    onShow={handleShow}
                    onClear={handleClearReports}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Không có báo cáo nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ModeratorReports;
