// routes/posts.js

const express = require("express");
const router = express.Router();
const db = require("../models");
const { Post, Account } = db;
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

// GET tất cả bài viết công khai
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { status: "published" },
            order: [["published_at", "DESC"]],
            attributes: [
                "id",
                "title",
                "body",
                "status",
                "tag",
                "published_at",
                "image_url",
                "image",
                "video_url",
                "video"
            ],
            include: [
                {
                    model: Account,
                    as: "author",
                    attributes: ["id", "name", "avatar"]
                }
            ]
        });

        const postsWithMedia = posts.map(post => {
            const postData = post.toJSON();
            if (postData.image && Buffer.isBuffer(postData.image)) {
                postData.imageBase64 = `data:image/jpeg;base64,${postData.image.toString('base64')}`;
                delete postData.image;
            }
            if (postData.video && Buffer.isBuffer(postData.video)) {
                postData.videoBase64 = `data:video/mp4;base64,${postData.video.toString('base64')}`;
                delete postData.video;
            }
            let type = "text";
            if (postData.video || postData.video_url || postData.videoBase64) {
                type = "video";
            } else if (postData.image || postData.image_url || postData.imageBase64) {
                type = "image";
            }

            return {
                id: postData.id,
                title: postData.title,
                body: postData.body,
                author: postData.author?.name || "Admin",
                avatar: postData.author?.avatar || "☕",
                createdAt: new Date(postData.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                type: type,
                imageUrl: postData.imageBase64 || postData.image_url,
                videoUrl: postData.videoBase64 || postData.video_url,
                tag: postData.tag
            };
        });

        return res.json(postsWithMedia);
    } catch (error) {
        console.error("Error fetching public posts:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// GET tất cả bài của user hiện tại
router.get("/me", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const posts = await Post.findAll({
            where: { account_id: userId },
            order: [["published_at", "DESC"]],
            attributes: [
                "id",
                "title",
                "body",
                "status",
                "tag",
                "published_at",
                "image_url",
                "image",
                "video_url",
                "video"
            ]
        });

        const postsWithMedia = posts.map(post => {
            const postData = post.toJSON();
            if (postData.image && Buffer.isBuffer(postData.image)) {
                postData.imageBase64 = `data:image/jpeg;base64,${postData.image.toString('base64')}`;
                delete postData.image;
            }
            if (postData.video && Buffer.isBuffer(postData.video)) {
                postData.videoBase64 = `data:video/mp4;base64,${postData.video.toString('base64')}`;
                delete postData.video;
            }
            return postData;
        });
        return res.json(postsWithMedia);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// POST tạo bài viết mới hoặc cập nhật
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, title, body, tag, imageUrl, imageFile, videoUrl, videoFile, status, publishedAt } = req.body;
        
        // Validation
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Tiêu đề không được để trống" });
        }
        if (!body || body.trim() === "") {
            return res.status(400).json({ message: "Nội dung không được để trống" });
        }
        if (!tag || tag.trim() === "") {
            return res.status(400).json({ message: "Thẻ (Tag) không được để trống" });
        }
        if (!publishedAt) {
            return res.status(400).json({ message: "Ngày lên lịch không được để trống" });
        }

        let imageBuffer = null;
        let videoBuffer = null;
        if (imageFile && imageFile.startsWith('data:')) {
            const base64Data = imageFile.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
        }
        if (videoFile && videoFile.startsWith('data:')) {
            const base64Data = videoFile.split(',')[1];
            videoBuffer = Buffer.from(base64Data, 'base64');
        }

        if (id) {
            const post = await Post.findOne({ where: { id, account_id: userId } });
            if (!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }
            await post.update({
                title: title || post.title,
                body: body || post.body,
                tag: tag || post.tag,
                image_url: imageUrl || post.image_url,
                image: imageBuffer || post.image,
                video_url: videoUrl || post.video_url,
                video: videoBuffer || post.video,
                status: status || post.status,
                published_at: publishedAt ? new Date(publishedAt) : post.published_at
            });
            return res.json({ message: "Cập nhật thành công", post });
        } else {
            const newPost = await Post.create({
                title,
                body,
                tag,
                image_url: imageUrl,
                image: imageBuffer,
                video_url: videoUrl,
                video: videoBuffer,
                account_id: userId,
                status: status || 'draft',
                published_at: new Date(publishedAt)
            });
            return res.status(201).json({ message: "Tạo bài viết thành công", post: newPost });
        }
    } catch (error) {
        console.error("Error creating/updating post:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;