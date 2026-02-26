import React from 'react';
import { Outlet } from 'react-router-dom';
import authBackground from '@/assets/auth.png'; 
import logo from '@/assets/logo_auth.svg'; 

const AuthLayout = () => {
  return (
    <div className="grid grid-cols-2 h-screen w-screen">
      <div className="relative flex items-center justify-center bg-[#FFF8E7]">
        <img src={logo} alt="Logo" className="absolute top-[40px] left-[40px] w-[100px]" />
        <img src={authBackground} alt="Auth Background" className="w-[80%] max-w-[500px] h-auto" />
      </div>

      <div className="flex items-center justify-center bg-[#ECFCFC]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;