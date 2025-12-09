'use client'
//==============================
// car driving on the road the controller manages the traffic (socket connections)
//==============================
import { useEffect, useState } from 'react'
import { connect, io, type Socket } from 'socket.io-client'
import { Connect } from './io-calls/io-connections'

//socket will be used to connect to server!
let socket: Socket | null = null

export default function SocketDemo() {
  //connection need to be not on
  const [connected, setConnected] = useState(false)
  //will hold messages from 
  const [messages, setMessages] = useState<string[]>([])
  const [value, setValue] = useState('')
  const [userName, setUserName] = useState<string | null>(null)

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
    console.log('Socket connected')

    //server event listeners 
    /*
    server.on 
    */
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    console.log('Socket disconnected')

    socket.on('message', (msg: string) => {
      setMessages((m) => [...m, msg])
    })

    socket.emit('message', 'You are like a car so lets drive this thing!')

    socket.emit('custom-event', { info: 'This is a custom event from the client.' })
    console.log('Custom event emitted from client')

    // Cleanup on unmount
    // Disconnect the socket when the component unmounts
    // This prevents memory leaks and ensures the socket is properly closed
    // when the component is no longer in use.
    return () => {
      if (socket) {
        socket.disconnect()
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
    //send a message!
    socket.emit('message', value)
    /*=================
      messages set here
      =================
    */
    setMessages((m) => [...m, `${socket?.id}: ${value}`])
    setValue('')
  }


  const userNameValue = () => {
   //if else bloacks

   if (socket) {
     if (userName !== null) {
      return userName
   }
      return `<--------`
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
          <li key={i} className="text-sm">
            {m}
          </li>
        ))}
      </ul>
    </div>
  )
}
