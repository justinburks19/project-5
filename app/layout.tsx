"use client"
import '../styles/global.css'
import { ReactNode } from 'react'
import {useState} from 'react'
import Home from './page'

import {ThreeDText} from '../styles/theeDText'
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className=" min-h-screen items-center justify-center p-6 sticky justify-items-center">
          <div className="w-full justify-center text-center mb-4">
              <ThreeDText className="text-5xl "text="Welcome to Project 5" />
      <p className="text-gray-600 text-xl">Next.js + TypeScript + Socket.io + React</p>
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
