socket.ts = traffic controller
socketDemo.tsx = car driving on the road the controller manages

Step 0 - Page Loads
React component mounts
│
├─ useEffect:
│    fetch("/api/socket")  ─────────▶  socket.ts handler runs:
│                                     - if no io yet → create new Server(...)
│                                     - attach io to res.socket.server
│                                     - set up io.on("connection", ...)
│
└─ Then client calls: const socket = io({ path: "/api/socket" })

Step 1 – Socket connects
Client side:
  const socket = io({ path: "/api/socket" })

Socket.IO does handshake with server
          ▼
Server side:
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id)
    // set up socket.on("message") and socket.on("disconnect") here
  })

Client side:
  socket.on("connect", () => {
    // this fires automatically after handshake is done
    setConnected(true)
  })

Step 2 – You send a message from the browser
socket.emit("message", "hello from client")

Browser:
  socket.emit("message", "hello from client")
      │
      ▼
Server (socket.ts):
  socket.on("message", (msg) => {
    console.log("message from", socket.id, msg)
    io.emit("message", msg)
  })
      │
      ▼
All connected browsers:
  socket.on("message", (msg) => {
    // This runs on EVERY connected client
    // including the original sender
    setMessages((prev) => [...prev, msg])
  })

socket.emit("message", data) (client → server)

socket.on("message", handler) (server listens)

io.emit("message", data) (server → all clients)

socket.on("message", handler) (clients listen)

Step 3 – Disconnect
Server:
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason)
  })

Client:
  socket.on("disconnect", () => {
    setConnected(false)
  })

