//Setup socket connection on server side
//==============================
// TRaffic Controller
//==============================

//IO.emit sends to all clients
// socket.emit sends to the client that sent the message
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

      /* 
      Listen for 'message' events from the client
      When a message is received, log it and broadcast it to all connected clients
      socket.on('What the server is listening for', 
      (data from client) => { server logic }
            Server Logic can include 
            socket.emit('event name', data) to send to the specific client
            io.emit('event name', data) to send to all connected clients
            io.broadcast.emit('event name', data) to send to all except sender
            io.to(room).emit('event name', data) to send to all in a room
            socket.join(room) to join a room
            socket.leave(room) to leave a room

      );
      */
      socket.on('message', (username?: string, msg?: string) => {
        console.log('message from', socket.id, msg)
        // broadcast to all clients (including sender) - change to socket.broadcast.emit to exclude sender
        io.emit('message', { username, msg } ); // Emit the message to all connected clients
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
      socket.on(`get-id`, () => {
        console.log('get-id event received for socket:', socket.id)
        io.emit('get-id', socket.id) //emit to all clients
      })

      //Server Wide Messages
      socket.on('server-message', (msg) => {
        console.log('Server-wide message from', socket.id, msg)
        // Broadcast to only this client
        socket.emit('server-message', msg) // Only this client gets it 
      })

    })
  } else {
    console.log('Socket.IO already running')
  }

  res.status(200).end()
}
