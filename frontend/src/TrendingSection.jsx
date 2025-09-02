import { useState } from "react";

export default function TrendingSection() {
  const initialTrending = [
    { id: 1, img: "/pin1.jpg", likes: 120, views: 500, shares: 30 },
    { id: 2, img: "/pin2.jpg", likes: 90, views: 400, shares: 25 },
    { id: 3, img: "/pin3.jpg", likes: 150, views: 600, shares: 50 },
  ];

  const [trending, setTrending] = useState(initialTrending);

  const handleLike = (id) => {
    setTrending((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleView = (id) => {
    setTrending((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, views: item.views + 1 } : item
      )
    );
  };

  const handleShare = (id) => {
    setTrending((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, shares: item.shares + 1 } : item
      )
    );
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-2">Trending 🔥</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {trending.map((item) => (
          <div
            key={item.id}
            className="min-w-[200px] rounded-lg shadow-md overflow-hidden bg-white"
          >
            <img
              src={item.img}
              alt="trending"
              className="w-full h-40 object-cover cursor-pointer"
              onClick={() => handleView(item.id)}
            />

            <div className="flex justify-around text-sm p-2">
              <button
                onClick={() => handleLike(item.id)}
                className="hover:text-red-500 transition"
              >
                ❤️ {item.likes}
              </button>

              <button
                onClick={() => handleView(item.id)}
                className="hover:text-blue-500 transition"
              >
                👁 {item.views}
              </button>

              <button
                onClick={() => handleShare(item.id)}
                className="hover:text-green-500 transition"
              >
                🔗 {item.shares}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
