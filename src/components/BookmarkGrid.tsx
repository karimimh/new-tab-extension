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

  // Combine folders and bookmarks into a single list
  const combinedItems = [...folders, ...bookmarks];

  // Handle empty folder
  if (combinedItems.length === 0) {
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

      {/* Display combined items */}
      <div className="flex items-center flex-wrap gap-4">
        {combinedItems.map((item: BookmarkTreeNode) =>
          item.url ? (
            <BookmarkItem key={item.id} title={item.title} url={item.url} />
          ) : (
            <FolderItem
              key={item.id}
              id={item.id}
              title={item.title}
              children={item.children || []}
              onClick={() => navigateToFolder(item)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default BookmarkGrid;
