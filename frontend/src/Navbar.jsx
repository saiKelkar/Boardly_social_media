import { useEffect, useState } from "react";

export default function Navbar({ username }) {
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-500">Boardly</div>

      {/* Search + Username */}
      <div className="flex-1 mx-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <span className="font-semibold whitespace-nowrap">
          Hello {username}
        </span>
      </div>
    </nav>
  );
}
