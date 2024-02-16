// server.js
import express from "express";
import cors from "cors";
import connect from "./db.js";
import dotenv from "dotenv";
import Authrouter from "./route/Auth.route.js";
import Userrouter from "./route/User.route.js";
import cookieParser from "cookie-parser";
import Todorouter from "./route/Todo.route.js";
import path from "path";
dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

// routes
app.use("/api", Authrouter);
app.use("/api", Userrouter);
app.use("/api/todo", Todorouter);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error"; // Fix: Correct assignment
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`SERVER CONNECTED SUCCESSFULLY ON PORT ${port}`);
    });
  } catch (err) {
    console.log(`FAILED TO CONNECT TO PORT ${err}`);
  }
};

// start server
start();
