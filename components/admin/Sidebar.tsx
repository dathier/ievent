import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        <Link
          href="/admin"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/website"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Website Management
        </Link>
        <Link
          href="/admin/events"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Event Management
        </Link>
        <Link
          href="/admin/venues"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Venue Management
        </Link>
        <Link
          href="/admin/interactions"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Interaction Management
        </Link>
        <Link
          href="/admin/stats"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Statistics
        </Link>
        <Link
          href="/admin/users"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          User Management
        </Link>
      </nav>
    </div>
  );
}
