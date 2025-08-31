import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function FeedGrid() {
  // mock data
  const initialPins = [
    { id: 1, img: "/pin4.jpg", title: "Modern Kitchen" },
    { id: 2, img: "/pin5.jpg", title: "Nature Walk" },
    { id: 3, img: "/pin6.jpg", title: "Street Art" },
    { id: 4, img: "/pin7.jpg", title: "Scandinavian Design" },
  ];

  const [pins, setPins] = useState(initialPins);

  // simulate fetching new pins
  const fetchMorePins = () => {
    const newPins = Array.from({ length: 6 }, (_, i) => ({
      id: pins.length + i + 1,
      img: `/pin${(pins.length + i) % 5 + 1}.jpg`, // cycle mock images
      title: `New Pin ${pins.length + i + 1}`,
    }));
    setPins((prev) => [...prev, ...newPins]);
  };

  return (
    <InfiniteScroll
      dataLength={pins.length}
      next={fetchMorePins}
      hasMore={true}
      loader={<h4 className="text-center py-4">Loading...</h4>}
      endMessage={
        <p className="text-center py-4 font-semibold">
          🎉 Yay! You’ve seen it all.
        </p>
      }
    >
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="break-inside-avoid rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={pin.img}
              alt={pin.title}
              className="w-full object-cover"
            />
            <p className="p-2 font-medium text-gray-800">{pin.title}</p>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
