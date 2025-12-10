"use client"
import '../styles/global.css'
import { ReactNode } from 'react'
import {useState} from 'react'

import {ThreeDText} from '../styles/theeDText'
export default function RootLayout({ children }: { children: ReactNode }) {

    return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className=" min-h-screen items-center justify-center p-6 sticky justify-items-center">
          <div className="w-full max-w-3xl">
              <ThreeDText text="Welcome to Project 5" />
      <p className="text-gray-600">Next.js + TypeScript + Socket.io + React</p>
      <ol className="list-decimal list-inside text-2xl">
        Important Socket.io commands include
        <li>socket.emit(event, data), responsible for sending data to the server</li>
        <li>socket.on(event, callback), used to listen for events from the server</li>
        <li>socket.disconnect(), used to disconnect from the server</li>
      </ol>
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
