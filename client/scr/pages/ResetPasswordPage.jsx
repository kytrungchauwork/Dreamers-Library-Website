import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './ResetPasswordPage.css';
import { authService } from '@/api/authService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    if (!token) {
      setError('Token không hợp lệ. Vui lòng thử lại từ email.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      alert('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      navigate('/dang-nhap');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] font-['Quicksand'] text-[#333]">
      <h2 className="text-[28px] font-bold text-center mb-[25px]">Tạo mật khẩu mới</h2>
      <p className="text-center mt-[-15px] mb-[25px] text-[#666] leading-[1.5]">
        Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.
      </p>
      
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input 
            type="password" 
            id="newPassword" 
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmNewPassword">Nhập lại mật khẩu mới</label>
          <input 
            type="password" 
            id="confirmNewPassword" 
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;