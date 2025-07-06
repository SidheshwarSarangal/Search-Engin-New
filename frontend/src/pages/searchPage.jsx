import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchTile from "../components/SearchTile";
import SearchBar from "../components/searchBar";
import { ArrowLeft } from "lucide-react";

const RESULTS_PER_PAGE = 8;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const query = queryParams.get("q") || "";
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}&page=1`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-blue-600 my-8">
        <button
          className={`px-3 py-1 rounded border ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:underline"}`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pages.map((num, i) =>
          num === "..." ? (
            <span key={i} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={i}
              onClick={() => handlePageChange(num)}
              className={`px-3 py-1 rounded ${num === currentPage ? "bg-blue-600 text-white font-bold" : "hover:underline"}`}
            >
              {num}
            </button>
          )
        )}

        <button
          className={`px-3 py-1 rounded border ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:underline"}`}
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-4 md:px-6 shadow-sm">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Back button on small screens */}
          <div className="sm:hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-lg">Back</span>
            </button>
          </div>

          {/* Logo and SearchBar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full">
            <div className="text-2xl font-semibold text-blue-600">Perdo</div>
            <div className="flex-1 w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Back button on larger screens */}
          <div className="hidden sm:block">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-lg">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-6">
        <p className="mb-4 text-sm text-gray-500">
          Showing results for: <span className="text-blue-600 font-medium break-all">{query}</span>
        </p>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading...</p>
        ) : paginatedResults.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedResults.map((item, index) => (
                <SearchTile key={index} result={item} />
              ))}
            </div>
            <div className="border-t pt-6 flex justify-start">{renderPagination()}</div>
          </>
        ) : (
          <p className="text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
