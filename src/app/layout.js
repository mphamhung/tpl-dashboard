import { Inter } from 'next/font/google'
import './globals.css'

import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TPL Dashboards',
  description: 'An alternate view of your stats',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar></NavBar>
        {children}
     </body>
    </html>
  )
}
