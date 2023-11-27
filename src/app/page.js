import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Charts from '../components/Charts'
import Games from '../components/Games'

export default function Home() {
  return (
    <>
    <div className="flex">
    <main className="flex-grow ml-64 relative">
          <Games />
    </main>
    </div>
    </>
  )
}