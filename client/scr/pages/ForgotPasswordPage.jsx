import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './ForgotPasswordPage.css';
import { authService } from '@/api/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Vui lòng nhập email.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] font-['Quicksand'] text-[#333]">
      <h2 className="text-[28px] font-bold text-center mb-[25px]">Quên mật khẩu</h2>
      <p className="text-center mt-[-15px] mb-[25px] text-[#666] leading-[1.5]">
        Đừng lo lắng! Chỉ cần nhập email đã đăng ký của bạn và chúng tôi sẽ gửi cho bạn một mã để đặt lại mật khẩu.
      </p>
      
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email khôi phục</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi Code'}
        </button>
      </form>

      <p className="text-center mt-[20px] text-[14px]">
        <Link to="/dang-nhap" className="text-[#007bff] no-underline">Quay lại Đăng nhập</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;