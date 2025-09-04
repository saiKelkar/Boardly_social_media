import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getBoards, addPostToBoard, getPins } from "./Api/api";
import Masonry from "react-masonry-css";
import { usePins } from "./PinContext";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function FeedGrid({ createdPin }) {
  const { pins: contextPins, addPin } = usePins();
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);

  const [saveModal, setSaveModal] = useState(false);
  const [zoomModal, setZoomModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  // Fetch pins on mount
  useEffect(() => {
  const fetchPins = async () => {
    try {
      const res = await getPins();
      if (Array.isArray(res.data)) {
        res.data.forEach((p) => {
          if (p && p.id && !contextPins.some(cp => cp.id === p.id)) {
            addPin(p);
          }
        });
      } else {
        console.warn("Unexpected pins response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };
    fetchPins();
  }, [addPin, contextPins]);

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
    setPins(contextPins);
  }, [contextPins]);

  const fetchMorePins = () => {
    console.log("Fetch more pins (pagination can be added)");
  };

  const handleSaveClick = (pin) => {
    setSelectedPin(pin);
    setSaveModal(true);
  };

  const saveToBoard = async (boardId) => {
    try {
      if (!selectedPin) return;
      await addPostToBoard(boardId, selectedPin.id);
      console.log(`Saved pin ${selectedPin.id} to board ${boardId}`);
    } catch (err) {
      console.error("Error saving pin to board:", err);
    } finally {
      setSaveModal(false);
      setSelectedPin(null);
    }
  };

  const handlePinClick = (pin) => {
    setSelectedPin(pin);
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
              onClick={() => {
                setSelectedPin(pin);
                setZoomModal(true);
              }}
            >
              <img
                src={pin.image_url}
                alt={pin.title}
                className="w-full object-cover"
              />
              <p className="p-2 font-medium text-gray-800">{pin.title}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering zoom
                  setSelectedPin(pin);
                  setSaveModal(true);
                }}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                Save
              </button>
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>

      {saveModal && (
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
              onClick={() => setSaveModal(false)}
              className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {zoomModal && selectedPin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
            <button
              onClick={() => setZoomModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <img
              src={selectedPin.image_url}
              alt={selectedPin.title}
              className="w-full h-auto rounded-lg"
            />
            <h2 className="text-xl font-bold mt-4">{selectedPin.title}</h2>
            <p className="text-gray-600">{selectedPin.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
