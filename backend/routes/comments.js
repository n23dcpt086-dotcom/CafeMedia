// routes/comments.js

const express = require("express");
const router = express.Router();
const db = require("../models");
const { Comment, Account } = db;
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

// GET tất cả comments của một bài viết
router.get("/:postId", async (req, res) => {
    try {
        const postId = parseInt(req.params.postId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ message: "Post ID không hợp lệ" });
        }
        const comments = await Comment.findAll({
            where: { post_id: postId },
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: Account,
                    as: "author",
                    attributes: ["id", "name", "avatar"]
                }
            ]
        });
        const formattedComments = comments.map(comment => {
            const data = comment.toJSON();
            return {
                id: data.id,
                author: data.author?.name || "Người dùng",
                avatar: data.author?.avatar || "👤",
                text: data.text,
                createdAt: data.created_at
            };
        });
        return res.json(formattedComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// POST tạo comment mới
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId, text } = req.body;
        if (!postId) {
            return res.status(400).json({ message: "Thiếu post_id" });
        }
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }
        const newComment = await Comment.create({
            post_id: parseInt(postId, 10),
            account_id: userId,
            text: text.trim()
        });
        const commentWithAuthor = await Comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: Account,
                    as: "author",
                    attributes: ["id", "name", "avatar"]
                }
            ]
        });
        const data = commentWithAuthor.toJSON();
        const formatted = {
            id: data.id,
            author: data.author?.name || "Người dùng",
            avatar: data.author?.avatar || "👤",
            text: data.text,
            createdAt: data.created_at
        };
        return res.status(201).json(formatted);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// DELETE xóa comment (chỉ tác giả hoặc admin)
router.delete("/:commentId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = parseInt(req.params.commentId, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ message: "Comment ID không hợp lệ" });
        }
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }
        if (comment.account_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Không có quyền xóa bình luận này" });
        }
        await comment.destroy();
        return res.json({ message: "Xóa bình luận thành công" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;