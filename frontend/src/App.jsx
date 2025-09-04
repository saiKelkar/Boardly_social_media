import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import CreatePin from "./CreatePin";  
import Boards from "./Boards"; 
import BoardDetail from "./BoardDetail";       

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Create Pin */}
        <Route path="/create-pin" element={<CreatePin />} />

        {/* Boards */}
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
}
