import { useEffect, useState } from "react";
import { getDashboard } from "./Api/api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TrendingSection from "./TrendingSection";
import FeedGrid from "./FeedGrid";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setMessage(res.data.message);
      } catch (err) {
        setMessage("You are not logged in ❌");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16"> 
        {/* pt-16 pushes main content below navbar (assumes navbar height ~64px) */}

        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-64 z-10 bg-white shadow">
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-50">
          {message && (
            <h1 className="text-xl font-semibold mb-4">{message}</h1>
          )}

          <TrendingSection />
          <FeedGrid />
        </main>
      </div>
    </div>
  );
}
