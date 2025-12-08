'use client'

import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export default function SocketDemo() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    // Hit the API route once to ensure the server attaches Socket.IO
    fetch('/api/socket').catch(() => {})

    socket = io(undefined, { path: '/api/socket' })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('message', (msg: string) => {
      setMessages((m) => [...m, msg])
    })

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [])

  function send() {
    if (!socket) return
    if (!value.trim()) return
    socket.emit('message', value)
    setMessages((m) => [...m, `you: ${value}`])
    setValue('')
  }

  return (
    <div className="p-4 border rounded max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <strong>Socket status:</strong>
        <span>{connected ? 'connected' : 'disconnected'}</span>
      </div>

      <div className="mt-3 flex gap-2">
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
