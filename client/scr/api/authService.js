import api from './axiosConfig';

// Service cho các API liên quan đến authentication
export const authService = {
  // Đăng nhập
    
  login: async (email, password) => {
    console.log('authService login called with:', email, password);
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Social login (Google/Apple)
  socialLogin: async (userData) => {
    const response = await api.post('/auth/social-login', userData);
    return response.data;
  },

  // Lấy thông tin user hiện tại (dùng token)
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  }
};
