import Link from 'next/link'

export default function NavigationBar() {
   return (
    <div className='h-16 space-y-4'>
        <div className="flex flex-row justify-left w-full bg-gray-700 fixed overflow-hidden">
            <Link href="/#" className="m-4">
                <h1 > 
                Home
                </h1></Link>
            <Link href="/rankings" className="m-4 ">Rankings</Link>
        </div>
    </div>

    )

}