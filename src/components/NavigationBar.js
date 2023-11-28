import Link from 'next/link'

export default function NavigationBar() {
   return (
        <section className="grow justify-between space-y-4">
            <Link href="/#">Home</Link>
        </section>
    )

}