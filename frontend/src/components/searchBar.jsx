import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      onSearch(query);
    }
  };

  const clearInput = () => {
    setSearchInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative flex">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search personal blogs..."
        className="flex-grow px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
      />

      {/* ❌ Clear Button */}
      {searchInput && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute right-[108px] top-[18px] -translate-y-1/2 text-gray-500 hover:text-gray-700 text-4xl"
        >
          ×
        </button>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
