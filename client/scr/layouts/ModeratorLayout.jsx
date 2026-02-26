import React from "react";
import { Outlet } from "react-router-dom";

const ModeratorLayout = () => {
  return (
    <div className="w-full h-full">
      {/* Có thể thêm breadcrumb / tiêu đề admin ở đây */}
      <Outlet />
    </div>
  );
};

export default ModeratorLayout;