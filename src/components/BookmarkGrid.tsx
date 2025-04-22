import React from "react";
import BookmarkItem from "./BookmarkItem";
import FolderItem from "./FolderItem";
import FolderHeader from "./FolderHeader";
import { useBookmarkNavigation } from "../hooks/useBookmarkNavigation";
import { BookmarkTreeNode } from "../types/bookmarks";

const BookmarkGrid: React.FC = () => {
  const {
    currentFolder,
    navigationStack,
    loading,
    error,
    navigateToFolder,
    navigateBack,
    getFilteredContent,
  } = useBookmarkNavigation();

  if (loading) {
    return <div className="text-center py-8">Loading your bookmarks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const { bookmarks, folders } = getFilteredContent(currentFolder);
  const isRoot = navigationStack.length === 0;

  // Handle empty folder
  if (bookmarks.length === 0 && folders.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <FolderHeader
          title={currentFolder?.title || "Bookmarks"}
          showBackButton={!isRoot}
          onBack={navigateBack}
        />
        <p className="text-center text-gray-500 py-8">This folder is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <FolderHeader
        title={currentFolder?.title || "Bookmarks"}
        showBackButton={!isRoot}
        onBack={navigateBack}
      />

      {/* Display folders first */}
      {folders.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder: BookmarkTreeNode) => (
              <FolderItem
                key={folder.id}
                id={folder.id}
                title={folder.title}
                children={folder.children || []}
                onClick={() => navigateToFolder(folder)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Display bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Bookmarks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bookmarks.map((bookmark: BookmarkTreeNode) => (
              <BookmarkItem
                key={bookmark.id}
                title={bookmark.title}
                url={bookmark.url || ""}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;
