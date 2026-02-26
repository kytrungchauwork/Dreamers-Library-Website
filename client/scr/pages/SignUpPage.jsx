import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password, confirmPassword } = formData;
    if (!fullName || !username || !email || !password) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    try {
      const result = await register({
        fullName,
        username,
        email,
        password,
        role: 'user'
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      setError('Đăng ký thất bại.');
    }
  };

  return (
    <div className="w-full max-w-[400px] font-['Quicksand'] text-[#333]">
      <h2 className="text-[28px] font-bold text-center mb-[25px]">Đăng ký</h2>
      <p className="text-center mt-[-15px] mb-[25px] text-[#666]">Hãy bắt đầu một cuộc hành trình mới</p>
      
      <form onSubmit={handleSignUp}>
        <div className="mb-[20px]">
          <label htmlFor="fullName" className="block mb-[8px] font-medium">Họ và Tên</label>
          <input 
            type="text" id="fullName" 
            placeholder="Nhập họ và tên của bạn" 
            value={formData.fullName} 
            onChange={handleChange} 
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] box-border"
          />
        </div>
        <div className="mb-[20px]">
          <label htmlFor="username" className="block mb-[8px] font-medium">Tên đăng nhập</label>
          <input 
            type="text" id="username" 
            placeholder="Nhập tên đăng nhập" 
            value={formData.username} 
            onChange={handleChange} 
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] box-border"
          />
        </div>
        <div className="mb-[20px]">
          <label htmlFor="email" className="block mb-[8px] font-medium">Email</label>
          <input 
            type="email" id="email" 
            placeholder="Nhập email của bạn" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] box-border"
          />
        </div>
        <div className="mb-[20px]">
          <label htmlFor="password" className="block mb-[8px] font-medium">Mật khẩu</label>
          <input 
            type="password" id="password" 
            placeholder="Nhập mật khẩu" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] box-border"
          />
        </div>
        <div className="mb-[20px]">
          <label htmlFor="confirmPassword" className="block mb-[8px] font-medium">Nhập lại mật khẩu</label>
          <input 
            type="password" id="confirmPassword" 
            placeholder="Nhập lại mật khẩu" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] box-border"
          />
        </div>

        {error && <p className="text-[#dc3545] text-[14px] text-center mb-[15px]">{error}</p>}

        <button type="submit" className="w-full p-[14px] text-[16px] font-bold text-white bg-[#007bff] border-none rounded-[8px] cursor-pointer hover:bg-[#0056b3] transition-colors">
          Đăng ký
        </button>
      </form>

      <p className="text-center mt-[20px] text-[14px]">
        Đã có tài khoản? <Link to="/dang-nhap" className="text-[#007bff] no-underline">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default SignUpPage;