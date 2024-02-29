import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="h-16 space-y-4">
      <div className="flex flex-row justify-left w-full bg-gray-700 fixed overflow-hidden">
        <Link href="/#" className="m-4">
          <h1>Current Season</h1>
        </Link>
        <Link href="/rankings" className="m-4 ">
          View All Data
        </Link>
        <Link href="/leagues" className="m-4 ">
          Past Seasons
        </Link>
        {/* TODO make this a drop down */}
      </div>
    </div>
  );
}
