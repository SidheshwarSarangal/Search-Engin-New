import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/searchBar";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}&page=1`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center -mt-16 items-center px-4">
      <h1 className="text-7xl md:text-9xl font-bold text-blue-700 mb-8">Perdo</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default Home;
