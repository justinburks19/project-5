"use client"

import SocketDemo from '../clientRoom/SocketDemo'

export default function Home() {    
  const handleGetStarted = () => {
    window.location.href = '/get-started'
  }
  const handleApiSocketRules = () => {
    window.location.href = '/api-socket'
  }
  return (
    <section className="text-center pt-5">

      <button onClick={handleGetStarted} className='
      bg-sky-500 rounded-2xl p-4 mr-4 font-extrabold'>Chat Room</button>
    </section>
  )
}
