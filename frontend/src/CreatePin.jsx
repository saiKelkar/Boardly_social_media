import React, { useState } from "react";
import { createPin } from "./Api/api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // split comma-separated keywords into array
      const keywordArray = keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);
      formData.append("keywords", keywordArray.join(","));

      // must match multer field name in backend (image)
      formData.append("file", image);

      await createPin(formData);

      alert("Pin created successfully!");
      setTitle("");
      setDescription("");
      setKeywords("");
      setImage(null);
    } catch (error) {
      console.error("Error creating pin:", error);
      alert("Failed to create pin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-64 z-10 bg-white shadow">
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Create a New Pin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                rows={3}
              />

              <input
                type="text"
                placeholder="Keywords (comma separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                {loading ? "Uploading..." : "Create Pin"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePin;
