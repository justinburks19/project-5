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
    <section className="text-center">

      <button onClick={handleGetStarted} className='bg-sky-500 rounded-2xl p-4 mr-4'>Get Started</button>
      <button onClick={handleApiSocketRules} className='bg-sky-500 rounded-2xl p-4'>API Socket Rules</button>
    </section>
  )
}
