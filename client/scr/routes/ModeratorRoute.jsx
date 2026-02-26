// client/src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const ModeratorRoute = ({ children }) => {
  const { isLoggedIn, isModerator } = useAuth(); // isModerator bây giờ là boolean true/false

  if (!isLoggedIn) {
    return <Navigate to="/dang-nhap" replace />;
  }

  // KHÔNG dùng isModerator(), chỉ dùng isModerator
  if (!isModerator) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ModeratorRoute;
