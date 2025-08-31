import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-50 border-r h-screen p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="block text-lg font-medium hover:text-red-500">
            Home
          </Link>
        </li>
        <li>
          <Link to="/create-pin" className="block text-lg font-medium hover:text-red-500">
            Create Pin
          </Link>
        </li>
        <li>
          <Link to="/boards" className="block text-lg font-medium hover:text-red-500">
            Boards
          </Link>
        </li>
      </ul>
    </aside>
  );
}
