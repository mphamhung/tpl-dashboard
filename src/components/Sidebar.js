const Sidebar = () => {
  return (
    <>
      <aside className="fixed top-0 left-0 w-64 h-full" aria label="Sidenav">
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <ul className="space-y-2">
            <li>
              <a href="/games" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span className="ml-3">Games</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar;