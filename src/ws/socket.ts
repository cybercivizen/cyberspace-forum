import { Server } from "socket.io";
import { createServer } from "http";
import { jwtVerify } from "jose";

const secretKey = "32e7ab757c041a7adb77c60c0d98a423";
const encodedKey = new TextEncoder().encode(secretKey);

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

io.use(async (socket, next) => {
  const cookie = socket.handshake.headers.cookie;
  console.log("Socket cookies:", cookie);
  if (!cookie) {
    return next(new Error("Authentication error"));
  }
  const sessionCookie = cookie
    .split(";")
    .find((c) => c.trim().startsWith("session="));
  if (!sessionCookie) {
    return next(new Error("Authentication error"));
  }
  const session = sessionCookie.split("=")[1];
  const payload = await decrypt(session);
  if (!payload) {
    return next(new Error("Authentication error"));
  }
  socket.data.user = payload;
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.data.user.username);

  socket.on("sendMessage", (data) => {
    // Broadcast to all connected clients
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.user.username);
  });
});

const PORT = process.env.WS_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
