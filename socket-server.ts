import { Server } from "socket.io";
import { createServer } from "http";
import { jwtVerify } from "jose";

const secretKey = "fc98fada3bda36dfe7d28e93afb3bff8";
const encodedKey = new TextEncoder().encode(secretKey);

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {}
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.use(async (socket, next) => {
  const cookie = socket.handshake.headers.cookie;
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
  console.log("Authenticated user:", socket.data.user);
  next();
});

io.on("connection", (socket) => {
  socket.on("sendMessage", (data) => {
    // Broadcast to all connected clients
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.user.username);
  });
});

const PORT = process.env.WS_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
