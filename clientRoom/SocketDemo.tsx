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
  const [userName, setUserName] = useState<string | null>(null)
  //socket id state
  const [socketId, setSocketId] = useState<string | null>(null)
  //All users which are connected
  const [allUsers, setAllUsers] = useState<{ socketId: string, username: string | null }[]>([])
  //Submit Name 
  const [nameSubmitted, setNameSubmitted] = useState(false)
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
    if (connected || nameSubmitted) return null;
    return (
      <>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={userName ?? ''}
          onChange={(e) => setUserName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="Enter your name"
        />
      </div>
      <div className="flex w-full justify-center pt-2">
        <button
          onClick={() => {
            if (!userName || userName.trim() === '') {
              alert('Please enter a valid name before submitting.');
              return;
            }
            setNameSubmitted(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded col-span-3 max-w-sm"
        >
          Submit Name
        </button>
      </div>
      </>
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
    call.off('registered')
    call.off('users-update')
    call.off('register-error')

    /*===================================================
    Listen for messages from server
    =====================================================*/
    //set up connect listener
    call.on('connect', () => {
      console.log('Socket connected with ID:', call.id)
      setConnected(true)
      
      //set socket id state
      const socketId = call.id;
      if (!socketId) return;
      setSocketId(socketId);

      //register username with server
      call.emit('register', userName.trim());
    });

    //set up disconnect listener
    call.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setMessages((prev) => [...prev, `Disconnected: ${reason}`])
      setConnected(false)
    })

    //listen for messages from server
    call.on("message", (data: { socketId: string; username: string; msg: string }) => {
      console.log("Message from server:", data);
    setMessages((prev) => [...prev, `${data.username}: ${data.msg}`]);
    });

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

    //listener for registetered event
    call.on('registered', (data: { socketId: string; username: string }) => {
      console.log('Registered with server:', data)
      setMessages((prev) => [...prev, `Registered name: ${data.username}, Socket ID: ${data.socketId}`])
    })

    call.on("users-update", (users: { socketId: string; username: string }[]) => {
    console.log("Users update:", users);
    setAllUsers(users);
    });

    call.on("register-error", (data: { error: string }) => {
    alert(data.error);
    });

    call.on("user-disconnected", (data: { socketId: string; reason: string }) => {
      console.log(`User disconnected: ${data.socketId}, Reason: ${data.reason}`);
      setMessages((prev) => [...prev, `User disconnected: ${data.socketId}, Reason: ${data.reason}`]);
    });

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
    console.log('All Users:', allUsers)
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
    if (!connected) return
    //send a message to the server!
    socket.emit('message', value)
    /*=================
      messages set here
      =================
    */
    setValue('')
  }



  return (
    <div className="p-4 border rounded mx-auto w-xs sm:w-xs md:w-md lg:w-lg xl:w-xl 2xl:w-2xl">
      {socketStatus()}

      <div className='grid grid-cols'>

        <div>
          {!connected && enterName()}
        </div>
        {nameSubmitted && (connectButton())}
        
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
          <div className="mt-4">
            <h3 className="font-bold mb-2">All Connected Users:</h3>
            <ul className="space-y-1 max-h-40 overflow-auto text-left">
              {allUsers.map((user, index) => (
                <li key={index} className="text-lg">
                  {`User Name: ${user.username}, Socket ID: ${user.socketId}`}
                </li>
              ))}
            </ul>
          </div>
        </div>

      )
      }
    </div>
  )
}



