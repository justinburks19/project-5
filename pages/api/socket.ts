import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // First time the route is hit, attach Socket.IO to the server
  if (!(res.socket as any).server.io) {
    console.log('Initializing Socket.IO server...')
    const io = new Server((res.socket as any).server, {
      // optional: customize pingInterval, cors, etc.
      path: '/api/socket'
    })

    ;(res.socket as any).server.io = io

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      socket.on('message', (msg: string) => {
        console.log('message from', socket.id, msg)
        // broadcast to all clients (including sender) - change to socket.broadcast.emit to exclude sender
        io.emit('message', msg)
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', socket.id, reason)
      })
    })
  } else {
    // Socket is already initialized
    // console.log('Socket.IO already running')
  }

  res.status(200).end()
}
