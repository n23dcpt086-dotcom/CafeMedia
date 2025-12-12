// routes/dashboard.js

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");
const { Account, Post, Schedule } = db;

const jwt = require("jsonwebtoken");
const config = require("../config/config");

function auth(req, res, next) {
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

const startOfMonth = (d) =>
  new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

const endOfMonth = (d) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const startOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);

const endOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const monthKey = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

function lastNMonthKeys(n) {
  const keys = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // ===== KPI =====
    const publishedPosts = await Post.count({
      where: { status: "published" },
    });

    const totalUsers = await Account.count();

    const newUsersThisMonth = await Account.count({
      where: {
        created_at: {
          [Op.gte]: monthStart,
          [Op.lte]: monthEnd,
        },
      },
    });

    // ===== Posts published in last 6 months =====
    const sixMonthKeys = lastNMonthKeys(6);
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0
    );

    const postsInRange = await Post.findAll({
      where: {
        status: "published",
        published_at: {
          [Op.gte]: sixMonthsAgo,
          [Op.lte]: monthEnd,
        },
      },
      attributes: ["id", "published_at"],
    });

    const postsCountByMonth = Object.fromEntries(
      sixMonthKeys.map((k) => [k, 0])
    );

    for (const p of postsInRange) {
      const d = new Date(p.published_at);
      if (Number.isNaN(d.getTime())) continue;
      const k = monthKey(d);
      if (postsCountByMonth[k] !== undefined) {
        postsCountByMonth[k]++;
      }
    }

    const postsLast6Months = sixMonthKeys.map((k) => ({
      month: k,
      count: postsCountByMonth[k],
    }));

    // ===== Tag distribution =====
    const allPostsTags = await Post.findAll({
      attributes: ["id", "tag"],
    });

    const tagMap = new Map();
    for (const p of allPostsTags) {
      if (!p.tag) continue;
      tagMap.set(p.tag, (tagMap.get(p.tag) || 0) + 1);
    }

    const tagDistribution = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    // ===== Schedules in current month =====
    const schedulesThisMonth = await Schedule.findAll({
      where: {
        account_id: userId,
        publish_time: {
          [Op.gte]: monthStart,
          [Op.lte]: monthEnd,
        },
      },
      order: [["publish_time", "ASC"]],
      attributes: [
        "id",
        "title",
        "publish_time",
        "channel",
        "note",
        "post_id",
      ],
    });

    // ===== Today schedules =====
    const today = new Date();
    const todaySchedules = await Schedule.findAll({
      where: {
        account_id: userId,
        publish_time: {
          [Op.gte]: startOfDay(today),
          [Op.lte]: endOfDay(today),
        },
      },
      order: [["publish_time", "ASC"]],
      attributes: ["id", "title", "publish_time", "channel"],
    });

    // ===== Recent activities =====
    const recentSchedules = await Schedule.findAll({
      where: { account_id: userId },
      order: [["created_at", "DESC"]],
      limit: 5,
      attributes: ["id", "title", "created_at"],
    });

    const recentPosts = await Post.findAll({
      where: { account_id: userId },
      order: [["id", "DESC"]],
      limit: 5,
      attributes: ["id", "title", "status", "published_at"],
    });

    const recentActivities = [
      ...recentSchedules.map((s) => ({
        type: "schedule",
        text: `Tạo lịch: ${s.title}`,
        time: s.created_at,
      })),
      ...recentPosts.map((p) => ({
        type: "post",
        text: `Bài viết: ${p.title} (${p.status})`,
        time: p.published_at,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.time || 0).getTime() -
          new Date(a.time || 0).getTime()
      )
      .slice(0, 8);

    return res.json({
      kpi: {
        publishedPosts,
        totalUsers,
        newUsersThisMonth,
      },
      postsLast6Months,
      tagDistribution,
      schedulesThisMonth,
      todaySchedules,
      recentActivities,
    });
  } catch (e) {
    console.error("Error dashboard:", e);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;