// controllers/authController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../config/db.js";
import { sendResetPasswordEmail } from "../utils/emailService.js";

// Helper tạo token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "secret_key",
    {
      expiresIn: "1d", // Token sống 1 ngày
    }
  );
};

// 1. SIGN UP
export const signup = async (req, res) => {
  try {
    console.log("🆕 Signup request received:", req.body);
    const { fullName, username, email, password } = req.body;

    // Check user tồn tại
    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Lưu DB (chỉ lưu username, email, password_hash - bỏ fullName nếu DB chưa có column)
    const userId = await User.create({ username, email, password_hash });

    // Tạo token để auto-login sau khi đăng ký
    const token = generateToken(userId, "user");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, username, email, role: "user" },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. SIGN IN (Kèm logic Account Lock)
export const signin = async (req, res) => {
  console.log("🔐 Login request received:", req.body);
  try {
    const { email, password } = req.body;
    console.log("📧 Email:", email);

    // Tìm user
    const user = await User.findByEmail(email);
    console.log("👉 USER TỪ DB:", user);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Nếu user bị ban -> cấm đăng nhập
    if (user.is_banned) {
      return res
        .status(403)
        .json({ message: "Tài khoản này đã bị cấm. Không thể đăng nhập." });
    }

    // Check xem có bị khóa không (Flow 2.2.2.1)
    if (user.lockout_until && new Date() < new Date(user.lockout_until)) {
      return res.status(403).json({
        message: `Account is locked until ${user.lockout_until}. Please contact support.`,
      });
    }

    // Check Password (Flow Valid/Invalid)
    // Lưu ý: User social login sẽ không có password hash
    if (!user.password_hash) {
      return res
        .status(400)
        .json({ message: "Please login with Google/Apple" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Flow Invalid Credentials: Tăng biến đếm sai
      await User.incrementFailedAttempts(user.id);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Đăng nhập thành công -> Reset biến đếm lock
    await User.resetFailedAttempts(user.id);

    // Tạo Token
    const role = user.role || "user";
    console.log("👉 ROLE GỬI VỀ CLIENT:", role);
    const token = generateToken(user.id, role);

    res.json({
      success: true, // THÊM FLAG SUCCESS
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: role,
        fullName: user.full_name || user.username,
      }, // Đảm bảo role được trả về
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. SOCIAL LOGIN (Google/Apple)
export const socialLogin = async (req, res) => {
  try {
    const { email, username, provider, providerId } = req.body; // provider = 'google' | 'apple'

    // Check bảng social_logins
    let socialLink = await User.findSocialLogin(provider, providerId);
    let user;

    if (socialLink) {
      // Case 1: Đã từng login
      // Lấy thông tin user gốc
      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
        socialLink.user_id,
      ]);
      user = rows[0];
    } else {
      // Case 2: Chưa từng login -> Check xem email đã có trong bảng users chưa
      user = await User.findByEmail(email);

      if (!user) {
        // Case 2a: User mới tinh -> Tạo user (pass null)
        const userId = await User.create({
          username: username || email.split("@")[0],
          email,
          password_hash: null,
        });
        user = { id: userId, role: "user" };
      }

      // Link vào bảng social_logins
      await User.createSocialLogin(user.id, provider, providerId);
    }

    // Nếu user bị ban -> cấm đăng nhập
    if (user.is_banned) {
      return res
        .status(403)
        .json({ message: "Tài khoản này đã bị cấm. Không thể đăng nhập." });
    }

    // Tạo token trả về
    const token = generateToken(user.id, user.role || "user");
    res.json({ message: "Social login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Social login failed" });
  }
};

// 4. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    console.log("🔑 Forgot password request received:", req.body);
    const { email } = req.body;

    // Tìm user
    const user = await User.findByEmail(email);
    if (!user) {
      // Không tiết lộ email có tồn tại hay không (security)
      return res.json({
        message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.",
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    // Lưu token vào DB
    await User.saveResetToken(email, hashedToken, expiresAt);

    // Gửi email
    await sendResetPasswordEmail(email, resetToken);

    res.json({
      message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau." });
  }
};

// 5. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token và mật khẩu mới là bắt buộc." });
    }

    // Hash token để so sánh
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Tìm user với token hợp lệ
    const user = await User.findByResetToken(hashedToken);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu và xóa token
    await User.updatePassword(user.id, newPasswordHash);
    await User.clearResetToken(user.id);

    res.json({
      message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau." });
  }
};

// 6. GET CURRENT USER (ME)
export const getMe = async (req, res) => {
  try {
    // req.user đã được authMiddleware gán vào (chứa id, role)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role, // Quan trọng: Trả về role
        fullName: user.full_name || user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
