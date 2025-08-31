import { useState } from "react";
import AuthModal from "./AuthModel";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-red-500">Boardly</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Login / Signup
        </button>
      </nav>

      {/* Background */}
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "url('/image-bg.png')" }}>
        <h2 className="text-4xl text-white font-semibold drop-shadow-lg">
          Welcome to Boardly
        </h2>
      </div>

      {/* Modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
