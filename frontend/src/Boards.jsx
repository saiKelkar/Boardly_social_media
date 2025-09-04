import React, { useState, useEffect } from "react";
import { 
  getBoards, 
  getBoardByID, 
  createBoard, 
  updateBoard, 
  deleteBoard,
  getDashboard
} from "./Api/api";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Boards() {
  const [username, setUsername] = useState("");
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      const fetchData = async () => {
        const res = await getDashboard();
        setUsername(res.data.username);
      };
      fetchData();
    }, []);

  // Fetch boards on mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await getBoards();
      setBoards(res.data);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setError("Failed to load boards.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await createBoard({
        name,
        description,
      });
      setBoards((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating board:", err);
      setError("Failed to create board.");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((board) => board.id !== id));
    } catch (err) {
      console.error("Error deleting board:", err);
      setError("Failed to delete board.");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Navbar */}
      <Navbar username={username} />

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Page content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">My Boards</h1>

          {/* Create Board Form */}
          <form
            onSubmit={handleCreate}
            className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col gap-3 max-w-md"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Board name"
              className="border rounded-md p-2"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border rounded-md p-2"
              rows="3"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Board
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 mb-4">
              {error}
            </p>
          )}

          {/* Board List */}
          {loading ? (
            <p>Loading boards...</p>
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <Link to={`/boards/${board.id}`} key={board.id}>
                  <div
                    className="relative bg-white shadow rounded-lg p-4 hover:shadow-md transition"
                  >
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // prevent link navigation when deleting
                        handleDelete(board.id);
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>

                    {/* Board info */}
                    <h2 className="font-semibold text-lg">{board.name}</h2>
                    <p className="text-gray-600 mb-3">{board.description}</p>

                    {/* Board preview pins */}
                    {board.preview_posts && board.preview_posts.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {board.preview_posts.map((pin) => (
                          <img
                            key={pin.id}
                            src={pin.image_url}
                            alt={pin.title}
                            className="w-full h-20 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">No pins yet</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No boards yet. Create one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
