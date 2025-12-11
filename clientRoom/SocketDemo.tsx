'use client'
//==============================
// car driving on the road the controller manages the traffic (socket connections)
//==============================
import React, { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'


let socket: Socket | null = null

//function to connect to the server
function Connect(): Socket {
  //if no socket create one
  if (!socket) {
    //handshake to ensure server is ready
    fetch('/api/socket').catch((err) => console.log('Socket handshake error:', err))
    socket = io({ path: '/api/socket' }) //connect to server with correct path
  }
  
  return socket;
}
//socket will be used to connect to server!

export default function SocketDemo() {
  //connection need to be not on
  const [connected, setConnected] = useState(false)
  //will hold messages from 
  const [messages, setMessages] = useState<string[]>([])
  //input value
  const [value, setValue] = useState('')

  const[userName, setUserName] = useState<string | null[]>([null])


  const handleConnect = () => {
    const call = Connect();
    //set the sockettID
    


    call.on('connect', () => {
      console.log('Connected to server with ID:', call.id)
      setConnected(true)
    })
    call.on('message', (data) => {
      console.log('Message received:', data)
      setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.msg}`])
    })
    call.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      setConnected(false)
    })
    call.on('get-id', (id: string) => {
      console.log('Received socket ID from server:', id)

    })
  }

const handleDisconnect = () => {
  if (socket) {
    socket.disconnect()
    console.log('Socket disconnected manually')
    socket = null
  }
  setConnected(false)
}

  //ONLY for cleanup on unmount
  useEffect(() => {
    //will run once on mount
    handleConnect();
    
    return () => {
      if (socket) {
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
    socket.emit('message', socket.id, value)
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
      return socket.id //else return socket id
   } else {
      return 'No Socket Connected' //no socket at all
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
        <div className="mb-2 font-bold"> 
          {socket ? socket.id : 'No Socket Connected'}
        </div>
        </div>

        <div>
        <label className="mb-2 font-bold">User Name</label>
        <div className="mb-2 font-bold"> 
          {}
        </div>

        
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            value= {userName[0] || ''}
            onChange={(e) => setUserName([e.target.value])}
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
      {userName.map((user, index) => (
        <div key={index} className="mt-2 p-2 border rounded">
          <strong>User {index + 1} ID:</strong> {user}
        </div>
      ))}
    </div>
  )
}
