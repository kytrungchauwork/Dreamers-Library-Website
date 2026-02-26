import React from 'react';
import { Outlet } from 'react-router-dom';

const ReadingLayout = () => {
  return (
    <div className="bg-[#ECFCFC] min-h-screen">
      <Outlet />
    </div>
  );
};

export default ReadingLayout;