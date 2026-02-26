// client/src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth(); // isAdmin bây giờ là boolean true/false

  if (!isLoggedIn) {
    return <Navigate to="/dang-nhap" replace />;
  }

  // KHÔNG dùng isAdmin(), chỉ dùng isAdmin
  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;
