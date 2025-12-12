// routes/schedules.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const { Schedule, Post } = db;
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

const toISO = (d) => (d ? new Date(d).toISOString() : null);

// GET tất cả lịch của user hiện tại
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const schedules = await Schedule.findAll({
      where: { account_id: userId },
      order: [["publish_time", "ASC"]],
      include: [
        {
          model: Post,
          as: "post",
          attributes: ["id", "title", "status"],
        },
      ],
    });

    const schedulesData = schedules.map((schedule) => {
      const data = schedule.toJSON();
      return {
        id: data.id,
        title: data.title,
        publish_time: toISO(data.publish_time),
        channel: data.channel,
        note: data.note,
        post_id: data.post_id,
        post: data.post,
      };
    });

    return res.json(schedulesData);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// GET danh sách bài viết draft để chọn (cho cả tạo + sửa)
router.get("/draft-posts", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.findAll({
      where: {
        account_id: userId,
        status: "draft",
      },
      order: [["published_at", "DESC"]],
      attributes: ["id", "title", "tag", "published_at", "status"],
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
    const { title, publish_time, channel, post_id, note } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Tiêu đề không được để trống" });
    }
    if (!publish_time) {
      return res.status(400).json({ message: "Thời gian xuất bản không được để trống" });
    }
    if (!channel) {
      return res.status(400).json({ message: "Kênh xuất bản không được để trống" });
    }

    const parsed = new Date(publish_time);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: "publish_time không hợp lệ" });
    }

    if (post_id) {
      const post = await Post.findOne({
        where: { id: post_id, account_id: userId, status: "draft" },
        attributes: ["id"],
      });
      if (!post) {
        return res.status(404).json({ message: "Không tìm thấy bài viết nháp để liên kết" });
      }
    }

    const newSchedule = await Schedule.create({
      title: title.trim(),
      publish_time: parsed,
      channel,
      post_id: post_id || null,
      note: typeof note === "string" ? note : (post_id ? `Bài viết ID: ${post_id}` : ""),
      account_id: userId,
    });

    const scheduleWithPost = await Schedule.findByPk(newSchedule.id, {
      include: [{ model: Post, as: "post", attributes: ["id", "title", "status"] }],
    });

    const s = scheduleWithPost.toJSON();
    return res.status(201).json({
      message: "Tạo lịch thành công",
      schedule: { ...s, publish_time: toISO(s.publish_time) },
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// PUT cập nhật lịch (title, publish_time, note, post_id)
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { title, publish_time, note, post_id } = req.body;

    const schedule = await Schedule.findOne({
      where: { id, account_id: userId },
    });

    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch" });
    }

    if (title !== undefined) {
      if (!title || String(title).trim() === "") {
        return res.status(400).json({ message: "Tiêu đề không được để trống" });
      }
      schedule.title = String(title).trim();
    }

    if (publish_time !== undefined) {
      if (!publish_time) {
        return res.status(400).json({ message: "Thời gian xuất bản không được để trống" });
      }
      const parsed = new Date(publish_time);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "publish_time không hợp lệ" });
      }
      schedule.publish_time = parsed;
    }

    if (note !== undefined) {
      schedule.note = note === null ? null : String(note);
    }

    // post_id: cho phép null để bỏ liên kết, hoặc id draft để liên kết
    if (post_id !== undefined) {
      if (post_id === null || post_id === "" || post_id === 0) {
        schedule.post_id = null;
      } else {
        const pid = Number(post_id);
        if (!Number.isFinite(pid) || pid <= 0) {
          return res.status(400).json({ message: "post_id không hợp lệ" });
        }

        const post = await Post.findOne({
          where: { id: pid, account_id: userId, status: "draft" },
          attributes: ["id"],
        });
        if (!post) {
          return res.status(404).json({ message: "Không tìm thấy bài viết nháp để liên kết" });
        }
        schedule.post_id = pid;
      }
    }

    await schedule.save();

    const scheduleWithPost = await Schedule.findByPk(schedule.id, {
      include: [{ model: Post, as: "post", attributes: ["id", "title", "status"] }],
    });

    const s = scheduleWithPost.toJSON();
    return res.json({
      message: "Cập nhật lịch thành công",
      schedule: { ...s, publish_time: toISO(s.publish_time) },
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// DELETE xóa lịch
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const schedule = await Schedule.findOne({
      where: { id, account_id: userId },
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