import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
// 获取 CORS 配置的 origin
const origin = process.env.NEXT_PUBLIC_APP_URL || "http://10.112.100.70:3000";
console.log(`Using CORS origin: ${origin}`);

const io = new Server(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected");

  socket.on("join", (data) => {
    console.log("User joined survey:", data.surveyId);
    socket.join(data.surveyId);
  });

  socket.on("newResponse", (data) => {
    console.log("New response received:", data);
    io.to(data.surveyId).emit("newResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
