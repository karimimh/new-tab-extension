export interface BookmarkTreeNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkTreeNode[];
}

export interface NavigationItem {
  id: string;
  title: string;
  node: BookmarkTreeNode;
}
