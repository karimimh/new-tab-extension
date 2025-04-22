import React, { useEffect, useState } from "react";

interface BookmarkProps {
  title: string;
  url: string;
  favicon?: string;
}

interface FolderProps {
  title: string;
  children: BookmarkTreeNode[];
  isOpen: boolean;
  onToggle: () => void;
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

const BookmarkFolder: React.FC<FolderProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  // Filter out system folders (usually at the top level)
  const isSystemFolder =
    title === "Bookmarks bar" ||
    title === "Other bookmarks" ||
    title === "Mobile bookmarks";
  const displayTitle = isSystemFolder ? "" : title;

  // Only show bookmarks and folders that have bookmarks
  const bookmarks = children.filter((node) => node.url);
  const subfolders = children.filter(
    (node) => !node.url && node.children && node.children.length > 0
  );

  if (bookmarks.length === 0 && subfolders.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {displayTitle && (
        <div className="flex items-center mb-4">
          <button
            onClick={onToggle}
            className="mr-2 text-blue-600 hover:text-blue-800"
            aria-label={isOpen ? "Collapse folder" : "Expand folder"}
          >
            {isOpen ? "▼" : "►"}
          </button>
          <h3 className="text-xl font-medium">{displayTitle}</h3>
        </div>
      )}

      {isOpen && (
        <>
          {bookmarks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {bookmarks.map((bookmark) => (
                <BookmarkItem
                  key={bookmark.id}
                  title={bookmark.title}
                  url={bookmark.url || ""}
                />
              ))}
            </div>
          )}

          {subfolders.map((subfolder) => (
            <BookmarkSubfolder key={subfolder.id} folder={subfolder} />
          ))}
        </>
      )}
    </div>
  );
};

const BookmarkSubfolder: React.FC<{ folder: BookmarkTreeNode }> = ({
  folder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Only show if folder has content (directly or indirectly)
  const hasContent =
    folder.children &&
    (folder.children.some((node) => node.url) ||
      folder.children.some(
        (node) => node.children && node.children.length > 0
      ));

  if (!hasContent) return null;

  return (
    <div className="ml-6 border-l-2 border-gray-200 pl-4 my-2">
      <div className="flex items-center mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mr-2 text-blue-600 hover:text-blue-800"
          aria-label={isOpen ? "Collapse folder" : "Expand folder"}
        >
          {isOpen ? "▼" : "►"}
        </button>
        <h4 className="text-lg font-medium">{folder.title}</h4>
      </div>

      {isOpen && folder.children && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-3">
            {folder.children
              .filter((node) => node.url)
              .map((bookmark) => (
                <BookmarkItem
                  key={bookmark.id}
                  title={bookmark.title}
                  url={bookmark.url || ""}
                />
              ))}
          </div>

          {folder.children
            .filter(
              (node) => !node.url && node.children && node.children.length > 0
            )
            .map((subfolder) => (
              <BookmarkSubfolder key={subfolder.id} folder={subfolder} />
            ))}
        </>
      )}
    </div>
  );
};

const BookmarkGrid: React.FC = () => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkTreeNode[]>(
    []
  );
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // Check if running in a Chrome extension environment
        if (typeof chrome !== "undefined" && chrome.bookmarks) {
          // Get all bookmarks
          const bookmarkTree = await chrome.bookmarks.getTree();

          // Root node usually has a single child which contains all bookmarks
          const rootFolders = bookmarkTree[0]?.children || [];
          setBookmarkFolders(rootFolders);

          // Initialize all top-level folders as open
          const initialFolderStates: Record<string, boolean> = {};
          rootFolders.forEach((folder) => {
            initialFolderStates[folder.id] = true;
          });
          setFolderStates(initialFolderStates);
        } else {
          // For development outside of Chrome extension
          console.log("Chrome bookmarks API not available, using mock data");
          const mockData = getMockBookmarksWithFolders();
          setBookmarkFolders(mockData);

          // Initialize all mock folders as open
          const initialFolderStates: Record<string, boolean> = {};
          mockData.forEach((folder) => {
            initialFolderStates[folder.id] = true;
          });
          setFolderStates(initialFolderStates);
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

  const toggleFolder = (folderId: string) => {
    setFolderStates((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Mock data for development with folder structure
  const getMockBookmarksWithFolders = (): BookmarkTreeNode[] => {
    return [
      {
        id: "1",
        title: "Bookmarks bar",
        children: [
          { id: "11", title: "Google", url: "https://google.com" },
          { id: "12", title: "GitHub", url: "https://github.com" },
          {
            id: "13",
            title: "Development",
            children: [
              {
                id: "131",
                title: "Stack Overflow",
                url: "https://stackoverflow.com",
              },
              {
                id: "132",
                title: "MDN Web Docs",
                url: "https://developer.mozilla.org",
              },
              {
                id: "133",
                title: "Frameworks",
                children: [
                  { id: "1331", title: "React", url: "https://reactjs.org" },
                  { id: "1332", title: "Vue", url: "https://vuejs.org" },
                  { id: "1333", title: "Angular", url: "https://angular.io" },
                ],
              },
            ],
          },
          {
            id: "14",
            title: "Design",
            children: [
              { id: "141", title: "Dribbble", url: "https://dribbble.com" },
              { id: "142", title: "Behance", url: "https://behance.net" },
            ],
          },
        ],
      },
      {
        id: "2",
        title: "Other bookmarks",
        children: [
          {
            id: "21",
            title: "TypeScript",
            url: "https://www.typescriptlang.org",
          },
          { id: "22", title: "Tailwind CSS", url: "https://tailwindcss.com" },
        ],
      },
    ];
  };

  if (loading) {
    return <div className="text-center py-8">Loading your bookmarks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Bookmarks</h2>
      {bookmarkFolders.length === 0 ? (
        <p className="text-center text-gray-500">No bookmarks found</p>
      ) : (
        <div>
          {bookmarkFolders.map((folder) => (
            <BookmarkFolder
              key={folder.id}
              title={folder.title}
              children={folder.children || []}
              isOpen={folderStates[folder.id] || false}
              onToggle={() => toggleFolder(folder.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;
