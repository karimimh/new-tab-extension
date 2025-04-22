/// <reference types="chrome" />

// Define global chrome namespace if it doesn't exist in the environment
declare namespace chrome {
  export namespace bookmarks {
    export function getTree(): Promise<BookmarkTreeNode[]>;
    export function get(id: string): Promise<BookmarkTreeNode[]>;
    export function getChildren(id: string): Promise<BookmarkTreeNode[]>;
    export function getRecent(
      numberOfItems: number
    ): Promise<BookmarkTreeNode[]>;
    export function getSubTree(id: string): Promise<BookmarkTreeNode[]>;
    export function search(
      query:
        | string
        | {
            query?: string;
            url?: string;
            title?: string;
          }
    ): Promise<BookmarkTreeNode[]>;
  }
}

interface BookmarkTreeNode {
  id: string;
  parentId?: string;
  index?: number;
  url?: string;
  title: string;
  dateAdded?: number;
  dateGroupModified?: number;
  children?: BookmarkTreeNode[];
}
