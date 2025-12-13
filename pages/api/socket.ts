import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

// A collection to map socket IDs to usernames
const userIDS = new Map<string, string>();

// Helper to convert userIDS map to an array of user objects
function usersArray() {
  return Array.from(userIDS.entries()).map(([socketId, username]) => ({
    socketId,
    username,
  }));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure Socket.IO server is only initialized once
  if (!(res.socket as any).server.io) {
    console.log("Initializing Socket.IO server...");

    // Create a new Socket.IO server
    const io = new Server((res.socket as any).server, {
      path: "/api/socket",
    });

    // Attach Socket.IO server to Next.js server instance
    (res.socket as any).server.io = io;

    // Listen for client connections
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // ✅ Register user (NO ACK)
      socket.on("register", (username: string) => {
        // validate username by trimming whitespace
        const clean = (username ?? "").trim();
        if (!clean) {
          socket.emit("register-error", { error: "Invalid username" });
          return;
        }

        // store username for this socket
        userIDS.set(socket.id, clean);

        // confirm registration to ONLY this client
        socket.emit("registered", { socketId: socket.id, username: clean });

        // broadcast updated users list to everyone
        io.emit("users-update", usersArray());
      });

      // Chat message: use stored username
      socket.on("message", (msg: string) => {
        const username = userIDS.get(socket.id) ?? "Anonymous";
        io.emit("message", { socketId: socket.id, username, msg });
      });

      //this client asks for its username
      socket.on("get-username", () => {
        const username = userIDS.get(socket.id) ?? null;
        socket.emit("username", { socketId: socket.id, username });
      });

      // client requests current users list
      socket.on("get-users", () => {
        socket.emit("users-update", usersArray());
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", socket.id, reason);
        userIDS.delete(socket.id);
        io.emit("users-update", usersArray());
        io.emit("user-disconnected", { socketId: socket.id, reason });
      });
    });
  } else {
    console.log("Socket.IO already running");
  }

  res.status(200).end();
}
