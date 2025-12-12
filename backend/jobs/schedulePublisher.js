// jobs/schedulePublisher.js
const { Op } = require("sequelize");

let isRunning = false;

module.exports = function startSchedulePublisherJob(db, opts = {}) {
  const { Schedule, Post, sequelize } = db;

  const intervalMs = Number(opts.intervalMs ?? 30_000);
  const graceMs = Number(opts.graceMs ?? 60_000);
  const log = opts.log ?? console.log;

  runOnce().catch((e) => log("[schedulePublisher] first run error:", e));

  const timer = setInterval(() => {
    runOnce().catch((e) => log("[schedulePublisher] tick error:", e));
  }, intervalMs);

  async function runOnce() {
    if (isRunning) return;
    isRunning = true;

    const now = new Date();
    const windowStart = new Date(now.getTime() - graceMs);

    try {
      const dueSchedules = await Schedule.findAll({
        where: {
          post_id: { [Op.ne]: null },
          publish_time: { [Op.between]: [windowStart, now] },
        },
        include: [
          {
            model: Post,
            as: "post",
            required: true,
            where: { status: "draft" },
            attributes: ["id", "status"],
          },
        ],
        attributes: ["id", "post_id", "publish_time"],
        order: [["publish_time", "ASC"]],
        limit: 500,
      });

      if (!dueSchedules.length) return;

      const postIds = [
        ...new Set(dueSchedules.map((s) => s.post_id).filter(Boolean)),
      ];

      await sequelize.transaction(async (t) => {
        await Post.update(
          { status: "published", published_at: now },
          {
            where: { id: { [Op.in]: postIds }, status: "draft" },
            transaction: t,
          }
        );
      });
    } finally {
      isRunning = false;
    }
  }

  return () => clearInterval(timer);
};