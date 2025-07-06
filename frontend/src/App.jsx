import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import SearchPage from "./pages/SearchPage";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (q) => {
    try {
      const response = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      console.log("🔍 Search results:", data);
      setQuery(q);
      setResults(data.results || []);
    } catch (error) {
      console.error("❌ Search failed:", error);
      setQuery(q);
      setResults([]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onSearch={handleSearch} />} />
        <Route
          path="/search"
          element={<SearchPage query={query} results={results} onSearch={handleSearch} onBack={() => window.history.back()} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
