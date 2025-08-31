import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* After login, redirect here */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
