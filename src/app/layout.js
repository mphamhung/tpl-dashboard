import { Inter } from 'next/font/google'
import './globals.css'

import NavigationBar from '@/components/NavigationBar'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TPL Dashboards',
  description: 'An alternate view of your stats',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar></NavigationBar>
        <Suspense fallback={<p>Loading...</p>}>
        {children}
        </Suspense>
     </body>
    </html>
  )
}
