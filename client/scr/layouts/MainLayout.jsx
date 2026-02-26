import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer'; 

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECFCFC] overflow-hidden">
      <div className="shrink-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="shrink-0 z-10 bg-[#ECFCFC]">
           <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-5 scroll-smooth">
          <Outlet />
          <Footer /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;