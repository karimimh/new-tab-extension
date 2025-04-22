import { useState, useEffect } from "react";
import { BookmarkTreeNode, NavigationItem } from "../types/bookmarks";

export const useBookmarkNavigation = () => {
  const [currentFolder, setCurrentFolder] = useState<BookmarkTreeNode | null>(
    null
  );
  const [navigationStack, setNavigationStack] = useState<NavigationItem[]>([]);
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

          // Create a virtual root folder containing all top-level folders
          const virtualRoot: BookmarkTreeNode = {
            id: "root",
            title: "Bookmarks",
            children: rootFolders,
          };
          setCurrentFolder(virtualRoot);
        } else {
          // For development outside of Chrome extension
          console.log("Chrome bookmarks API not available, using mock data");
          const mockData = getMockBookmarksWithFolders();

          // Create a virtual root folder containing all top-level folders
          const virtualRoot: BookmarkTreeNode = {
            id: "root",
            title: "Bookmarks",
            children: mockData,
          };
          setCurrentFolder(virtualRoot);
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

  // Navigate to a specific folder
  const navigateToFolder = (folder: BookmarkTreeNode) => {
    // Add current folder to navigation stack before moving to new folder
    if (currentFolder) {
      setNavigationStack([
        ...navigationStack,
        {
          id: currentFolder.id,
          title: currentFolder.title,
          node: currentFolder,
        },
      ]);
    }
    setCurrentFolder(folder);
  };

  // Navigate back to previous folder
  const navigateBack = () => {
    if (navigationStack.length > 0) {
      // Pop the last item from the navigation stack
      const newStack = [...navigationStack];
      const previousFolder = newStack.pop();

      if (previousFolder) {
        setCurrentFolder(previousFolder.node);
        setNavigationStack(newStack);
      }
    }
  };

  // Filter to get only bookmarks and folders with content
  const getFilteredContent = (folder: BookmarkTreeNode | null) => {
    if (!folder || !folder.children) return { bookmarks: [], folders: [] };

    const bookmarks = folder.children.filter((node) => node.url);
    const folders = folder.children.filter(
      (node) =>
        !node.url &&
        node.children &&
        (node.children.some((child) => child.url) ||
          node.children.some(
            (child) => !child.url && child.children && child.children.length > 0
          ))
    );

    return { bookmarks, folders };
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

  return {
    currentFolder,
    navigationStack,
    loading,
    error,
    navigateToFolder,
    navigateBack,
    getFilteredContent,
  };
};
