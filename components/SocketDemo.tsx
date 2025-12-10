'use client'
//==============================
// car driving on the road the controller manages the traffic (socket connections)
//==============================
import React, { useEffect, useState } from 'react'
import { connect, io, type Socket } from 'socket.io-client'
import { Connect } from './io-calls/io-connections'
import { serverHooks } from 'next/dist/server/app-render/entry-base'

//socket will be used to connect to server!
let socket: Socket | null = null

export default function SocketDemo() {
  //connection need to be not on
  const [connected, setConnected] = useState(false)
  //will hold messages from 
  const [messages, setMessages] = useState<string[]>([])
  //input value
  const [value, setValue] = useState('')
  //username state
  const [userName, setUserName] = useState<string | null>(null)
  //List of Users
  const [users, setUsers] = useState<React.ReactNode[]>([])
  


  const handleDisconnect = () => {
    if (socket) {
      try {
        socket.disconnect()
        console.log('Socket disconnected')
      } catch (error) {
        console.error('Error disconnecting socket:', error)
      }
      socket = null
    }
    setConnected(false)
  }

  const handleConnect = () => {
   try {
      socket = Connect();
      console.log('Socket connected')
      setConnected(true)
    } catch (error) {
      console.error('Error connecting socket:', error)
    }
  }
  //socket null at first and then connect!
  useEffect(() => {
    // Call the API route once to ensure the server attaches Socket.IO. 


    //handshack to connect
    socket = Connect();

    // Set to listen for events from the server
      socket.on('get-id', (id: string) => {
        console.log('Received id for user list:', id)
        setUsers((prevUsers) => [...prevUsers, id])
     
      });
      //we can now call get-id event to get the id of the socket
      socket.emit('get-id');
      //set users list for all to see

      
    //server event listeners 
    /*
    server.on 
    */
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    console.log('Socket disconnected')

    socket.on('message', (msg: string) => {
      console.log('Message received:', msg)
      // Handle the received message (e.g., update state to display it)
      /*
        Steps of the process:
        1. Client emits 'message' event with username and msg to server
        2. Server receives 'message' event, logs it, and broadcasts it to all clients
        3. All connected clients receive the 'message' event with the message data
        4. Each client updates its messages state to include the new message
      */
      setMessages((prev) => [...prev, msg])
    });

    socket.on('server-message', (msg) => {
      console.log('Server-wide message received:', msg)
      // Handle the received server-wide message
      setMessages((m) => [...m, `(Server Message): ${msg}`])
    });

    socket.emit('custom-event', { info: 'This is a custom event from the client.' })

    socket.emit('server-message', 'We are about to cook. Concepts of Socket.IO!')


    // Cleanup on unmount
    // Disconnect the socket when the component unmounts
    // This prevents memory leaks and ensures the socket is properly closed
    // when the component is no longer in use.
    return () => {
      if (socket) {
        //remove users from the list
        users.splice(users.indexOf(socket.id), 1)
        //disconnect socket
        socket.disconnect()
        socket.off('get-id')
        console.log('Socket disconnected')
        socket = null
      }
    }
  }, [])

  function send() {
    //if no socket dont create
    if (!socket) return
    //if a socket then create!
    if (!value.trim()) return
    if(!connected) return
    //send a message to the server!
    socket.emit('message', userName ? userName : 'Anonymous', value)
    /*=================
      messages set here
      =================
    */
    setValue('')
  }


  const userNameValue = () => {
    
   if (socket) { //if socket exists
     if (userName) { //if username exists
      return userName
   }
      return socket.id
   } else {
      return 'No Socket Connected'
   }

  


  }
  return (
    <div className="p-4 border rounded mx-auto w-xs sm:w-xs md:w-md lg:w-lg xl:w-xl 2xl:w-2xl">
      <div className="flex w-full justify-center">
        {!connected ? (
          <button onClick={handleConnect} className="bg-green-600 text-white px-3 py-1 rounded col-span-3 max-w-sm"> Connect Socket </button>
        ) : <button onClick={handleDisconnect} className="bg-red-600 text-white px-3 py-1 rounded col-span-3 max-w-sm"> Disconnect Socket </button>
      }      
      </div>  
        <div className="flex justify-center grid grid-cols-2">
        <strong className='font-bold text-yellow-500 text-xl flex justify-center'>Socket Status:</strong>
        <span className={`font-extrabold pl-2 text-2xl ${connected ? "text-green-500" : "text-red-500"}
        flex justify-center`}>{connected ? 'Connected' : 'Disconnected'}</span>
      </div>  
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {/* current socket ID */}
        <div>
        <label className="mb-2 font-bold">Socket ID:</label>
        <input
          type="text"
          value={socket ? socket.id : 'No Socket Connected'}
          readOnly
          className="border px-2 py-1 rounded w-full"
          placeholder='Socket ID'
        />
        </div>

        <div>
        <label className="mb-2 font-bold">User Name</label>
        <input
          type="text"
          value={userNameValue()} 
          className="border px-2 py-1 rounded w-full"
          placeholder='User Name'

        />
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            value={userName || ''}
            onChange={(e) => setUserName(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Enter your name"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type a message"
        />
        <button onClick={send} className="bg-blue-600 text-white px-3 py-1 rounded">
          Send
        </button>
      </div>

      <ul className="mt-4 space-y-1 max-h-40 overflow-auto text-left">
        {messages.map((m, i) => (
          <li key={i} className="text-sm flexss">
            {m}
          </li>
        ))}
      </ul>
      {users.map((user, index) => (
        <div key={index} className="mt-2 p-2 border rounded">
          <strong>User {index + 1} ID:</strong> {user}
        </div>
      ))}
    </div>
  )
}
