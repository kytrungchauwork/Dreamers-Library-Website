import { useEffect, useState } from "react";
import usersData from "@/data/users.json";
import Button from "@/components/button/Button.jsx";

/* ===== STATUS BADGE ===== */
const StatusBadge = ({ status }) => {
  const map = {
    ONLINE: "bg-green-100 text-green-700",
    OFFLINE: "bg-gray-100 text-gray-600",
    BANNED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex justify-center px-3 py-1 rounded-full text-sm font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
};

/* ===== USER ROW ===== */
const UserRow = ({ user, onChangeRole }) => {
  const [status, setStatus] = useState(user.status);
  const isBanned = status === "BANNED";

  return (
    <tr className="border-t">
      {/* Username */}
      <td className="px-4 py-3 font-medium w-[25%]">
        {user.username}
      </td>

      {/* Role */}
      <td className="px-4 py-3 w-[20%] text-center">
        <select
          value={user.role}
          onChange={(e) => onChangeRole(user, e.target.value)}
          className="border rounded px-2 py-1 text-sm w-28"
        >
          <option value="USER">User</option>
          <option value="MODERATOR">Moderator</option>
        </select>
      </td>

      {/* Ban */}
      <td className="px-4 py-3 text-center w-[15%]">
        <Button
          variant={isBanned ? "unban" : "ban"}
          size="small"
          onClick={() => setStatus(isBanned ? "OFFLINE" : "BANNED")}
        >
          {isBanned ? "Unban" : "Ban"}
        </Button>
      </td>

      {/* Delete */}
      <td className="px-4 py-3 text-center w-[15%]">
        <Button
          variant="delete"
          size="small"
          onClick={() => console.log("Delete user", user.id)}
        >
          Delete
        </Button>
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center w-[15%]">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
};

/* ===== TABLE ===== */
const UserTable = ({ title, data, onChangeRole }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-xl font-semibold">{title}</h2>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="max-h-[320px] overflow-y-auto">
        <table className="w-full table-fixed text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 w-[25%]">Username</th>
              <th className="px-4 py-3 w-[20%] text-center">Role</th>
              <th className="px-4 py-3 w-[15%] text-center">Ban</th>
              <th className="px-4 py-3 w-[15%] text-center">Delete</th>
              <th className="px-4 py-3 w-[15%] text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onChangeRole={onChangeRole}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Không tìm thấy người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

/* ===== MAIN PAGE ===== */
const ManageUsers = () => {
  const [moderators, setModerators] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setModerators(usersData.filter((u) => u.role === "MODERATOR"));
    setUsers(usersData.filter((u) => u.role === "USER"));
    setLoading(false);
  }, []);

  /* ===== CHANGE ROLE HANDLER ===== */
  const handleChangeRole = (user, newRole) => {
    if (user.role === newRole) return;

    if (newRole === "MODERATOR") {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setModerators((prev) => [...prev, { ...user, role: "MODERATOR" }]);
    } else {
      setModerators((prev) => prev.filter((u) => u.id !== user.id));
      setUsers((prev) => [...prev, { ...user, role: "USER" }]);
    }
  };

  const keyword = search.toLowerCase();

  const filteredModerators = moderators.filter((u) =>
    u.username.toLowerCase().includes(keyword)
  );

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(keyword)
  );

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <p className="text-gray-500 mt-1">
          Quản lý quyền, trạng thái và tài khoản người dùng
        </p>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm theo username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tables */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-10">
        <UserTable
          title="Moderator"
          data={filteredModerators}
          onChangeRole={handleChangeRole}
        />
        <UserTable
          title="User"
          data={filteredUsers}
          onChangeRole={handleChangeRole}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
