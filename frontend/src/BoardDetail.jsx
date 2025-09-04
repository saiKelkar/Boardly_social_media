import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBoardByID, getDashboard } from "./Api/api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function BoardDetail() {
  const [username, setUsername] = useState("");
  const { id } = useParams(); // board ID from URL
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
        const fetchData = async () => {
          const res = await getDashboard();
          setUsername(res.data.username);
        };
        fetchData();
      }, []);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const res = await getBoardByID(id);
        setBoard(res.data);
      } catch (err) {
        console.error("Error fetching board:", err);
        setError("Failed to load board.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!board) return null;

  return (
    <div className="flex-1 flex flex-col">
      <Navbar username={username} />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="p-6 w-full">
          <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
          <p className="text-gray-600 mb-6">{board.description}</p>

          {board.boardposts && board.boardposts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {board.boardposts.map((bp) => (
                <div
                  key={bp.post.id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <img
                    src={bp.post.image_url}
                    alt={bp.post.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{bp.post.title}</h3>
                    <p className="text-xs text-gray-500">{bp.post.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No pins saved in this board yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
