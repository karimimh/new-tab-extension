import React from "react";

interface BookmarkProps {
  title: string;
  url: string;
  favicon?: string;
}

const BookmarkItem: React.FC<BookmarkProps> = ({ title, url }) => {
  // Extract domain for favicon
  const domain = new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <a
      href={url}
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="rounded-lg shadow-md bg-white mb-2 p-2 overflow-hidden">
        <img
          src={faviconUrl}
          alt={title}
          className="w-12 h-12"
          onError={(e) => {
            // Fallback to a default icon if favicon fails to load
            (e.target as HTMLImageElement).src = "/vite.svg";
          }}
        />
      </div>
      <span className="text-sm text-center truncate max-w-full">{title}</span>
    </a>
  );
};

export default BookmarkItem;
