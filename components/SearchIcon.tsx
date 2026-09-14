import React from "react";

const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M21.5 16.5a8 8 0 0 1-13.5 2.72L6 20.5l6-1.75a8 8 0 0 1-.8-7.75 8 8 0 0 1 7.7 2.1zM6 5a2 2 0 0 0-2 2v3h3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5A2 2 0 0 0 6 5zm8 12a2 2 0 0 0 2-2h3a2 2 0 0 0 0-4h-3a2 2 0 0 0-2 2v3zm-9.3-5.3a1.8 1.8 0 0 1-1.8-1.8H5.3a1.8 1.8 0 0 1 0-3.6h9.8a1.8 1.8 0 0 1 1.8 1.8 1.8 1.8 0 0 1-1.8 1.8H7.5z"
      />
    </svg>
  );
};

export default SearchIcon;