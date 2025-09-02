import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPin, getDashboard } from "./Api/api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const CreatePin = () => {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        if (res?.data?.username) setUsername(res.data.username);
      } catch (err) {
        // not fatal — user might not be logged in
        console.warn("Could not fetch dashboard user:", err);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const keywordArray = keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);
      formData.append("keywords", keywordArray.join(","));

      // NOTE: backend expects 'file'
      formData.append("file", image);

      const res = await createPin(formData);

      // If backend returns the created pin, pass it to dashboard so FeedGrid can prepend it
      const createdPin = res?.data ?? null;

      // navigate to the dashboard (not "/") — this was the issue
      navigate("/dashboard", { state: { createdPin } });

      // optionally clear local form state (not necessary if navigating away)
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
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow">
        <Navbar username={username} />
      </div>

      <div className="flex flex-1 pt-16">
        <div className="fixed top-16 left-0 bottom-0 w-64 z-10 bg-white shadow">
          <Sidebar />
        </div>

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

              <div
                className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  {image ? (
                    <span className="font-medium text-gray-700">{image.name}</span>
                  ) : (
                    <span className="text-gray-500">
                      Drag & Drop your image here or <span className="text-blue-600 underline">Browse</span>
                    </span>
                  )}
                </label>
              </div>

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
