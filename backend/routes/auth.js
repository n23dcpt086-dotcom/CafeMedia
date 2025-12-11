const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account } = require("../models");
const config = require("../config/config");

// =============================
// POST /api/auth/login
// =============================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const user = await Account.findOne({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// =============================
// POST /api/auth/register
// =============================
router.post("/register", async (req, res) => {
    const { name, email, password, dateOfBirth, phone } = req.body;

    if (!name || !email || !password || !dateOfBirth || !phone)
        return res.status(400).json({ message: "Thiếu dữ liệu" });

    const exists = await Account.findOne({ where: { email } });
    if (exists)
        return res.status(400).json({ message: "Email đã tồn tại" });

    const hash = await bcrypt.hash(password, 10);

    const user = await Account.create({
        name,
        email,
        password: hash,
        role: "user",
        date_of_birth: dateOfBirth,
        phone
    });

    return res.json({
        message: "Tạo tài khoản thành công",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

module.exports = router;