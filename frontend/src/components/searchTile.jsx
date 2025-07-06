import React from "react";

const SearchTile = ({ result }) => {
  const { title, author, summary, url, reason } = result;

  if (!title || !summary || !url) return null;

  return (
    <div className="bg-white cursor-default p-4 sm:p-6 rounded shadow-sm border border-gray-200">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <h2 className="text-lg cursor-pointer sm:text-xl font-semibold text-blue-600 hover:underline break-words">{title}</h2>
      </a>

      <a  href={url} className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-1 break-all">{url}</a>

      {author && author.trim() !== "" && (
        <p className="text-sm text-gray-500">By {author}</p>
      )}

      {summary && summary.trim() !== "" && (
        <p className="mt-2 text-gray-700 text-sm sm:text-base">{summary}</p>
      )}

      {reason && reason.trim() !== "" && (
        <p className="text-xs text-gray-500 mt-2">{reason}</p>
      )}
    </div>
  );
};

export default SearchTile;
