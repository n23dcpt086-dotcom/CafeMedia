const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Account } = require("../models");
const config = require("../config/config");

// Middleware kiểm tra JWT
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

// GET /api/users/me (giữ nguyên)
router.get("/me", authRequired, async (req, res) => {
    if (req.user.role !== "user") return res.status(403).json({ message: "Không có quyền" });

    const user = await Account.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    return res.json({
        id: user.id,
        name: user.name,
        dateOfBirth: user.date_of_birth,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.created_at
    });
});


// PATCH /api/users/me — cập nhật thông tin + đổi mật khẩu
router.patch("/me", authRequired, async (req, res) => {
    if (req.user.role !== "user") return res.status(403).json({ message: "Không có quyền" });

    const user = await Account.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const { name, dateOfBirth, phone, avatar, oldPassword, newPassword } = req.body;

    // Không cho sửa email
    if (req.body.email)
        return res.status(400).json({ message: "Không được phép thay đổi email" });

    // Cập nhật thông tin cơ bản
    if (name !== undefined) user.name = name;
    if (dateOfBirth !== undefined) user.date_of_birth = dateOfBirth;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    if (oldPassword || newPassword) {
        if (!oldPassword || !newPassword)
            return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });

        const ok = await bcrypt.compare(oldPassword, user.password);
        if (!ok) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
    }

    await user.save();

    return res.json({ message: "Cập nhật thành công" });
});

module.exports = router;