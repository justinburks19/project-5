//Setup socket connection on server side
//==============================
// TRaffic Controller
//==============================
import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // if there isnt a response socket then attach Socket.IO
  if (!(res.socket as any).server.io) {
    console.log('Initializing Socket.IO server...')
    // io needs to be connected to the underlying HTTP server
    // Server is created by passing the underlying HTTP server to the Server constructor
    const io = new Server((res.socket as any).server, {
      // optional: customize pingInterval, cors, etc.
      path: '/api/socket'
    });

    //io is now initialized and attached to the server 
    //response.socket is the underlying HTTP server
    (res.socket as any).server.io = io

    //server/io is ensures connection is fired when a client connects
    //io is the Socket.IO server that manages all clients
    //socket represents one connected client; we listen for events from that client (like 'message' and 'disconnect')

    io.on('connection', (socket) => {
      console.log(
        '=============================\nSocket connected:', socket.id + "\n=============================")

      socket.on('message', (msg: string, username?: string) => {
        console.log('message from', socket.id, msg)
        // broadcast to all clients (including sender) - change to socket.broadcast.emit to exclude sender
        io.emit('message', username, msg ); // Emit the message to all connected clients
        //server.
      })

      // Handle disconnection event by listening for 'disconnect' event
      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', socket.id, reason)
      })

      // custom events can be added here
      socket.on('custom-event', (data) => {
        console.log('Custom event from', socket.id, data)
        // Handle custom event logic here
      })

      //get the id of the socket
      socket.on(`get-id`, (id) => {
        socket.emit('get-id', socket.id)
      })

    })
  } else {
    console.log('Socket.IO already running')
  }

  res.status(200).end()
}
