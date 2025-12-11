// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

sequelize.authenticate().then(() => {
  console.log("DB connected");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});