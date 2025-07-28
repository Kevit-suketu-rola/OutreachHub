const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const workspaceRouter = require("./routes/workspaceRoutes");
const workspaceUserRouter = require("./routes/workspaceUserRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/workspace", workspaceRouter);
app.use("/workspaceUser", workspaceUserRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hare Krishna" });
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
