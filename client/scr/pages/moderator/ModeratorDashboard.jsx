import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const ModeratorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Xin chào, <span className="font-medium">{user?.username}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quản lý truyện */}
        <Link
          to="/moderator/stories"
          className="block p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
        >
          <div className="text-lg font-semibold">📚 Quản lý truyện</div>
          <p className="text-sm text-gray-500 mt-1">
            Thêm, sửa, xóa và duyệt truyện
          </p>
        </Link>
        {/* Quản lý báo cáo */}
        <Link
          to="/moderator/reports"
          className="block p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
        >
          <div className="text-lg font-semibold">🚩 Quản lý báo cáo</div>
          <p className="text-sm text-gray-500 mt-1">
            Xem và xử lý các báo cáo từ người dùng
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
