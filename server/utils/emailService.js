import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASSWORD // App password (không phải mật khẩu Gmail thường)
  }
});

// Hàm gửi email reset password
export const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:5173/dat-lai-mat-khau?token=${resetToken}`;

  const mailOptions = {
    from: `"Book Reader" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Đặt lại mật khẩu - Book Reader',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Đặt lại mật khẩu</h2>
        <p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản Book Reader.</p>
        <p>Click vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Đặt lại mật khẩu
        </a>
        <p>Hoặc copy link sau vào trình duyệt:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${resetUrl}
        </p>
        <p style="color: #666; font-size: 14px;">
          Link này sẽ hết hạn sau <strong>1 giờ</strong>.
        </p>
        <p style="color: #666; font-size: 14px;">
          Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          © 2025 Book Reader. All rights reserved.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};
