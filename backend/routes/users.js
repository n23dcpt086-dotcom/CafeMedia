// routes/users.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Account } = require("../models");
const config = require("../config/config");

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Thiếu token" });

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

// GET /api/users/me
router.get("/me", authRequired, async (req, res) => {
  const acc = await Account.findByPk(req.user.id);
  if (!acc) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

  return res.json({
    id: acc.id,
    name: acc.name,
    dateOfBirth: acc.date_of_birth,
    phone: acc.phone,
    email: acc.email,
    avatar: acc.avatar,
    role: acc.role,
    createdAt: acc.created_at,
    updatedAt: acc.updated_at
  });
});

// PATCH /api/users/me
router.patch("/me", authRequired, async (req, res) => {
  const acc = await Account.findByPk(req.user.id);
  if (!acc) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

  const { name, dateOfBirth, phone, avatar, oldPassword, newPassword } = req.body;

  if (req.body.email) {
    return res.status(400).json({ message: "Không được phép thay đổi email" });
  }

  if (name !== undefined) acc.name = name;
  if (dateOfBirth !== undefined) acc.date_of_birth = dateOfBirth;
  if (phone !== undefined) acc.phone = phone;
  if (avatar !== undefined) acc.avatar = avatar;

  if (oldPassword || newPassword) {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });
    }
    const ok = await bcrypt.compare(oldPassword, acc.password);
    if (!ok) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    acc.password = await bcrypt.hash(newPassword, 10);
  }

  await acc.save();
  return res.json({ message: "Cập nhật thành công" });
});

module.exports = router;