import { ReactNode } from 'react'
export default function RootLayout({ children }: { children: ReactNode }) {

    return (
        <>
        <div className='w-full bg-blue-500 '> 
          {children}  
        </div>
        </>
        

    )
}