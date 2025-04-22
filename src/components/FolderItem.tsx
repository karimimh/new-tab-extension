import React from "react";
import { BookmarkTreeNode } from "../types/bookmarks";

interface FolderItemProps {
  id: string;
  title: string;
  children: BookmarkTreeNode[];
  onClick: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="rounded-lg shadow-md bg-white mb-2 p-2 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      </div>
      <span className="text-sm text-center truncate max-w-full">{title}</span>
    </button>
  );
};

export default FolderItem;
