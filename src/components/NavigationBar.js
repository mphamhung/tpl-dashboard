import Link from "next/link";
import { WakeIndicator } from "@/components/WakeIndicator";
export default function NavigationBar() {
  const links = [
    { href: "/#", text: "Current Season" },
    { href: "/rankings", text: "Rankings" },
    { href: "/leagues", text: "Past Seasons" },
    { href: "/search", text: "Find Player" },
  ];

  return (
    <nav className="fixed w-full h-14 py-2 bg-gray-700 z-10">
      <div className="flex justify-between items-center h-full w-full px-4 2xl:px16">
        <ul className="flex">
          {links.map((link) => {
            return (
              <Link href={link.href} className="ml-4 hover:border-b">
                {link.text}
              </Link>
            );
          })}
        </ul>
        <WakeIndicator />
      </div>
    </nav>
  );
}
