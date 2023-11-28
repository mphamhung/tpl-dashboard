import Link from 'next/link'

export default function NavigationBar() {
   return (
        <section className="grow justify-between space-y-4">
            <Link href="/#">
                <h1 className="m-4 align-middle"> 
                Home
                </h1></Link>
        </section>
    )

}