import jwt from "jsonwebtoken";
import db from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Không có token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, iat, exp }

    // 3. Lấy user từ DB (đảm bảo user còn tồn tại)
    const [rows] = await db.execute(
      `
      SELECT id, role, is_active, is_banned
      FROM users
      WHERE id = ?
      `,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    // 4. Check trạng thái user
    if (!user.is_active || user.is_banned) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    // 5. Gắn user vào request
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
