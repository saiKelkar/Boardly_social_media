import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getBoards, addPostToBoard, getPins } from "./Api/api";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function FeedGrid({ createdPin }) {
  const [pins, setPins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);

  // Fetch pins on mount
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await getPins();
        setPins(res.data); // backend returns real pins
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };
    fetchPins();
  }, []);

  // Fetch boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoadingBoards(true);
        const res = await getBoards();
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      } finally {
        setLoadingBoards(false);
      }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    if (createdPin) {
      setPins((prev) => {
        if (prev.some(p => p.id === createdPin.id)) return prev;
        return [createdPin, ...prev];
      });
    }
  }, [createdPin]);

  const fetchMorePins = () => {
    // Later, you can paginate with backend. For now, just return.
    console.log("Fetch more pins (pagination can be added)");
  };

  const handleSaveClick = (pin) => {
    setSelectedPin(pin);
    setShowModal(true);
  };

  const saveToBoard = async (boardId) => {
    try {
      if (!selectedPin) return;
      await addPostToBoard(boardId, selectedPin.id);
      console.log(`Saved pin ${selectedPin.id} to board ${boardId}`);
    } catch (err) {
      console.error("Error saving pin to board:", err);
    } finally {
      setShowModal(false);
      setSelectedPin(null);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={pins.length}
        next={fetchMorePins}
        hasMore={false} // disable infinite scroll for now
        loader={<h4 className="text-center py-4">Loading...</h4>}
        endMessage={
          <p className="text-center py-4 font-semibold">You’ve seen it all.</p>
        }
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="space-y-4"
        >
          {pins.map((pin) => (
            <div
              key={pin.id}
              className="relative rounded-lg overflow-hidden shadow-md bg-white group"
            >
              <img
                src={pin.image_url}
                alt={pin.title}
                className="w-full object-cover"
              />
              <p className="p-2 font-medium text-gray-800">{pin.title}</p>

              <button
                onClick={() => handleSaveClick(pin)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                Save
              </button>
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Save to board</h2>

            {loadingBoards ? (
              <p>Loading boards...</p>
            ) : boards.length > 0 ? (
              <ul className="space-y-2">
                {boards.map((board) => (
                  <li key={board.id}>
                    <button
                      onClick={() => saveToBoard(board.id)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                    >
                      {board.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No boards found. Create one first!
              </p>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
