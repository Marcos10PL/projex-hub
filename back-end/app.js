import "express-async-errors";
import dotenv from "dotenv";
import connect from "./db/connect.js";
import express from "express";
import authRouter from "./routes/auth.js";
import errorHandler from "./middlewares/error-handler.js";
import notFound from "./middlewares/not-found.js";
import cookieParser from "cookie-parser";
import projectsRouter from "./routes/projects.js";
import auth from "./middlewares/authentication.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";

// config
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const corsUrl = process.env.CORS_URL.toString();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 1000,
  message: {
    success: false,
    msg: "Too many requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// middleware
app.set("trust proxy", 1);
app.use(apiLimiter);
app.use(helmet());
app.use(cors({ origin: corsUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/projects", auth, projectsRouter);

// middleware
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsUrl,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// socket.io connection
io.on("connection", socket => {
  socket.on("joinRoom", ({ projectId }) => {
    socket.join(projectId);
  });

  socket.on("sendMessage", ({ projectId, message, username }) => {
    if (!socket.rooms.has(projectId)) return;

    io.to(projectId).emit("receiveMessage", { projectId, username, message });
    io.to(projectId).emit("stopTyping", { username });
  });

  socket.on("typing", ({ projectId, username }) => {
    if (!socket.rooms.has(projectId)) return;

    socket.to(projectId).emit("typing", { projectId, username });
  });

  socket.on("stopTyping", ({ projectId, username }) => {
    if (!socket.rooms.has(projectId)) return;

    socket.to(projectId).emit("stopTyping", { username });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// connect to database and start server
const startServer = async () => {
  try {
    await connect(process.env.MONGO_URI);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
