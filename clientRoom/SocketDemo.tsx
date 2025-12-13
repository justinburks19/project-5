'use client'
//==============================
// car driving on the road the controller manages the traffic (socket connections)
//==============================
import React, { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'


let socket: Socket | null = null

//function to connect to the server
function createSocket(): Socket {
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
  //username state
  const[userName, setUserName] = useState<string | null>(null)
  //socket id state
  const [socketId, setSocketId] = useState<string | null>(null)

  function socketStatus() {
    return (
    <div className="flex justify-center grid grid-cols-2">
        <strong className='font-bold text-yellow-500 text-xl flex justify-center'>Socket Status:</strong>
        <span className={`font-extrabold pl-2 text-2xl ${connected ? "text-green-500" : "text-red-500"}
        flex justify-center`}>{connected ? 'Connected' : 'Disconnected'}</span>
      </div> 
    )
  }
  function enterName() {
    return (
      <div>
          <label>Name:</label>
          <input
            type="text"
            value= {userName ?? ''}
            onChange={(e) => setUserName(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Enter your name"
          />
        </div>
    )
  }
  function connectButton() {
    return (
      <div className="flex w-full justify-center pt-5">
        {!connected ? (
          <button onClick={handleConnect} className="bg-green-600 text-white px-3 py-1 rounded col-span-3 max-w-sm"> {!socketId ? "Connect Socket" : "Reconnect Socket"} </button>
        ) : <button onClick={handleDisconnect} className="bg-red-600 text-white px-3 py-1 rounded col-span-3 max-w-sm"> Disconnect Socket </button>
      }      
      </div>)
  }

    //set the creating and setting up of the socket connection
  const handleConnect = () => {
    //if already connected dont reconnect
    if (socket?.connected) {
      return //already connected
    }

    //safety check
    if (!userName || userName.trim() === ``) {
      alert('Please enter a valid username before connecting.')
      return
    }


    const call = createSocket();
    //safety check
    if (!call) {
      console.log('Socket not created')
      return
    }


    //listen for messages from server(only attach once per socket)
    /*===================================================
    remove previous listeners to avoid duplicates
    =====================================================*/
    call.off('message')
    call.off('disconnect') 
    call.off('connect')
    call.off('custom-event')
    call.off('get-id')
    call.off('server-message')

    /*===================================================
    Listen for messages from server
    =====================================================*/
    //set up connect listener
    call.on('connect', () => {
      console.log('Socket connected with ID:', call.id)
      setConnected(true)
      //set socket id state
      if (call.id) {
        setSocketId(call.id)
      }
      //register username with server
      if (userName) {
        call.emit('register', userName)
      }
      
    })

    //set up disconnect listener
    call.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setConnected(false)
    })

    //listen for messages from server
    call.on('message', (data: { username?: string; msg?: string }) => {
      console.log('Message from server:', data)
      const displayName = data.username ? `${data.username}` : 'Anonymous'
      setMessages((prev) => [...prev, `${displayName}: ${data.msg}`])
    })

    //message from server to only this client
    call.on('server-message', (msg: string) => {
      console.log('Server message to this client:', msg)
      setMessages((prev) => [...prev, `Server: ${msg}`])
    })

    //get id response from server
    call.on('get-id', (id: string) => {
      console.log('Received socket ID from server:', id)
      setMessages((prev) => [...prev, `Socket ID from server: ${id}`])
    })  

    //Handle userID state
    
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
    //only resoponsible for cleanup
    console.log('SocketDemo mounted')
    return () => {
      if (socket) {
        //disconnect socket
        socket.off('connect')
        socket.off('disconnect')
        socket.off('message')
        socket.off('server-message')
        socket.off('get-id')
        socket.disconnect()
        console.log('Socket disconnected on unmount')
        socket = null
      }
    }
  }, [])

  function send() {
    //if no socket dont create
    if (!socket || !socket.connected) return
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
      {socketStatus()}

      <div className='grid grid-cols'>

      <div>
      {!connected && enterName()}
      </div>
      {connectButton()}
      </div>
         
      {userName && userName.trim() !== '' && connected && (
        <div>
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
          {userName ?? socket?.id}
        </div>
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
      {userName && (
        <div className="mt-2 p-2 border rounded">
          <strong>User ID:</strong> {userName}
        </div>
      )}</div>)}
      
      
    </div>
  )
}
