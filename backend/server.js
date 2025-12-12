// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const { sequelize } = db;

const startSchedulePublisherJob = require("./jobs/schedulePublisher");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/schedules", require("./routes/schedules"));

sequelize.authenticate().then(() => {
  startSchedulePublisherJob(db, { intervalMs: 30_000, graceMs: 60_000 });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});