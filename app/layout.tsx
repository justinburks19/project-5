import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Project 5',
  description: 'Next.js + TypeScript + Tailwind scaffold'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  )
}
