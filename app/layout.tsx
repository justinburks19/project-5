"use client"
import '../styles/global.css'
import { ReactNode } from 'react'
import {useState} from 'react'

import {ThreeDText} from '../styles/theeDText'
export default function RootLayout({ children }: { children: ReactNode }) {
  const clientCommands = [
    { client: 'socket.emit(event, data)', description: 'Sends data to the server' },
    { client: 'socket.on(event, callback)', description: 'Listens for events from the server' },
    { client: 'socket.disconnect()', description: 'Disconnects from the server' },
    { client: 'socket.connect()', description: 'Connects to the server' },
    { client: 'socket.id', description: 'Gets the unique socket ID assigned by the server' },
    { client: 'socket.connected', description: 'Boolean indicating if the socket is connected' },
    { client: 'socket.off(event)', description: 'Removes all listeners for the specified event' },
    { client: 'socket.close()', description: 'Closes the socket connection' },
  ]
  const serverCommands = [
    { server: 'io.on(event, callback)', description: 'Listens for client connections' },
    { server: 'socket.emit(event, data)', description: 'Sends data to a specific client' },
    { server: 'io.emit(event, data)', description: 'Broadcasts data to all connected clients' },
    { server: 'socket.on(event, callback)', description: 'Listens for events from a specific client' },
    { server: 'socket.id', description: 'Gets the unique socket ID for the connected client' },
    { server: 'socket.disconnect()', description: 'Disconnects the specific client' },
    { server: 'io.sockets.sockets', description: 'Accesses all connected sockets' },
    { server: 'io.close()', description: 'Closes the Socket.IO server' },
  ]
    return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className=" min-h-screen items-center justify-center p-6 sticky justify-items-center">
          <div className="w-full justify-center text-center mb-4">
              <ThreeDText className="text-5xl "text="Welcome to Project 5" />
      <p className="text-gray-600 text-xl">Next.js + TypeScript + Socket.io + React</p>
      
      <div className='gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mt-4 mb-4 p-4'>
        {/* Client Commands Section */}
      <div className= "bg-green-100/20">
      <ol className="list-decimal list-inside text-2xl">
        Client Commands as follows for example:
        {clientCommands.map((command, index) => (
          <li key={index} className="">
            <strong className="font-mono">{command.client}</strong>: {command.description}
          </li>
        ))}
      </ol>
      </div>
      {/* Server Commands Section */}
      <div className= "bg-blue-100/20">
      <ol className="list-decimal list-inside text-2xl">
        Server Commands as follows for example:
        {serverCommands.map((command, index) => (
          <li key={index} className="">
            <strong className="font-mono">{command.server}</strong>: {command.description}
          </li>
        ))}
      </ol>
      </div>
      </div>
            </div>
            <div className="w-full">

                <div className='flex justify-center'>
                    {children}
                </div>
            </div>
        </main>
      </body>
    </html>
  )
}
