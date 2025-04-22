import React, { useEffect, useState } from "react";

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
      <img
        src={faviconUrl}
        alt={title}
        className="w-12 h-12 mb-2"
        onError={(e) => {
          // Fallback to a default icon if favicon fails to load
          (e.target as HTMLImageElement).src = "/vite.svg";
        }}
      />
      <span className="text-sm text-center truncate max-w-full">{title}</span>
    </a>
  );
};

const BookmarkGrid: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // Check if running in a Chrome extension environment
        if (typeof chrome !== "undefined" && chrome.bookmarks) {
          // Get all bookmarks
          const bookmarkTree = await chrome.bookmarks.getTree();

          // Process bookmark tree to get top-level bookmarks
          const processedBookmarks = processBookmarkTree(bookmarkTree);
          setBookmarks(processedBookmarks);
        } else {
          // For development outside of Chrome extension
          console.log("Chrome bookmarks API not available, using mock data");
          setBookmarks(getMockBookmarks());
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Function to flatten bookmark tree and filter out folders
  const processBookmarkTree = (
    tree: BookmarkTreeNode[]
  ): BookmarkTreeNode[] => {
    const bookmarkItems: BookmarkTreeNode[] = [];

    const traverse = (nodes: BookmarkTreeNode[]) => {
      for (const node of nodes) {
        if (node.url) {
          bookmarkItems.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);
    return bookmarkItems;
  };

  // Mock data for development
  const getMockBookmarks = (): BookmarkTreeNode[] => {
    return [
      { id: "1", title: "Google", url: "https://google.com" },
      { id: "2", title: "GitHub", url: "https://github.com" },
      { id: "3", title: "Stack Overflow", url: "https://stackoverflow.com" },
      { id: "4", title: "React", url: "https://reactjs.org" },
      { id: "5", title: "TypeScript", url: "https://www.typescriptlang.org" },
      { id: "6", title: "Tailwind CSS", url: "https://tailwindcss.com" },
    ];
  };

  if (loading) {
    return <div className="text-center py-8">Loading your bookmarks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-500">No bookmarks found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              title={bookmark.title}
              url={bookmark.url || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;
