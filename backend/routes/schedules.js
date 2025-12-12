// routes/schedules.js

const express = require("express");
const router = express.Router();
const db = require("../models");
const { Schedule, Post, Account } = db;
const jwt = require("jsonwebtoken");
const config = require("../config/config");

function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Thiếu token" });

    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
}

// GET tất cả lịch của user hiện tại
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const schedules = await Schedule.findAll({
            where: { account_id: userId },
            order: [["publish_date", "ASC"]],
            include: [
                {
                    model: Post,
                    as: "post",
                    attributes: ["id", "title", "status"]
                }
            ]
        });

        const schedulesData = schedules.map(schedule => {
            const data = schedule.toJSON();
            return {
                id: data.id,
                title: data.title,
                publish_date: data.publish_date,
                channel: data.channel,
                note: data.note,
                post_id: data.post_id,
                post: data.post
            };
        });

        return res.json(schedulesData);
    } catch (error) {
        console.error("Error fetching schedules:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// GET danh sách bài viết draft để chọn
router.get("/draft-posts", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const posts = await Post.findAll({
            where: { 
                account_id: userId,
                status: 'draft'
            },
            order: [["published_at", "DESC"]],
            attributes: ["id", "title", "tag", "published_at"]
        });

        return res.json(posts);
    } catch (error) {
        console.error("Error fetching draft posts:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// POST tạo lịch mới
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, publish_date, channel, post_id } = req.body;

        // Validation
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Tiêu đề không được để trống" });
        }
        if (!publish_date) {
            return res.status(400).json({ message: "Ngày xuất bản không được để trống" });
        }
        if (!channel) {
            return res.status(400).json({ message: "Kênh xuất bản không được để trống" });
        }

        // Kiểm tra post_id nếu có
        if (post_id) {
            const post = await Post.findOne({
                where: { id: post_id, account_id: userId }
            });
            if (!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }
        }

        const newSchedule = await Schedule.create({
            title,
            publish_date,
            channel,
            post_id: post_id || null,
            note: post_id ? `Bài viết ID: ${post_id}` : "",
            account_id: userId
        });

        // Lấy lại schedule với thông tin post
        const scheduleWithPost = await Schedule.findByPk(newSchedule.id, {
            include: [
                {
                    model: Post,
                    as: "post",
                    attributes: ["id", "title", "status"]
                }
            ]
        });

        return res.status(201).json({ 
            message: "Tạo lịch thành công", 
            schedule: scheduleWithPost 
        });
    } catch (error) {
        console.error("Error creating schedule:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// DELETE xóa lịch
router.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const schedule = await Schedule.findOne({
            where: { id, account_id: userId }
        });

        if (!schedule) {
            return res.status(404).json({ message: "Không tìm thấy lịch" });
        }

        await schedule.destroy();
        return res.json({ message: "Xóa lịch thành công" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;