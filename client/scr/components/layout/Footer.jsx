import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="font-['Quicksand'] py-[40px] px-[20px] border-t border-[#eee]">
      <div className="max-w-[1200px] mx-auto flex justify-between gap-[40px]">
        <div className="shrink-0">
          <img src={logo} alt="Logo" className="w-[150px] mb-[20px]" />
          <p className="text-[14px] text-[#888]">
            © 2025 Book Online. All rights reserved.
          </p>
        </div>
        <div className="flex gap-[60px]">
          <div className="flex flex-col">
            <h4 className="text-[16px] font-bold m-0 mb-[15px]">Thông tin</h4>
            <Link to="/about-us" className="text-[#555] no-underline mb-[10px] transition-colors duration-200 hover:text-[#007bff]">Về chúng tôi</Link>
            <Link to="/contact" className="text-[#555] no-underline mb-[10px] transition-colors duration-200 hover:text-[#007bff]">Liên hệ</Link>
            <Link to="/terms" className="text-[#555] no-underline mb-[10px] transition-colors duration-200 hover:text-[#007bff]">Điều khoản dịch vụ</Link>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[16px] font-bold m-0 mb-[15px]">Theo dõi chúng tôi</h4>
            <div className="flex gap-[15px]">
              <Link to="https://www.facebook.com/dreamerlibraryk23" className="text-[#555] text-[20px] transition-colors duration-200 hover:text-[#007bff]"><FaFacebook /></Link>
              <Link to="https://www.instagram.com/dreamerslibrary123/?fbclid=IwY2xjawO-Tb9leHRuA2FlbQIxMABicmlkETF0dlpBektOQXRhbUVkOXJwc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHrPgLYNqh-OnmsRi_OfB7g8eI0dPff0OWxqS-y5fbDAmM5yqmV8dj9rc0kG__aem_KuCBLbOxWO1j3le84Dd5tQ" className="text-[#555] text-[20px] transition-colors duration-200 hover:text-[#007bff]"><FaInstagram /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;