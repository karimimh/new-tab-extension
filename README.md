# new-tab-extension

A Chrome extension (Manifest V3) that replaces the new tab page with a grid of your bookmarks, organized by folder. It is built with React 19, TypeScript, Vite and Tailwind CSS v4.

## Features

- **Replaces the new tab page.** The extension uses `chrome_url_overrides.newtab`, so every new tab opens on your bookmarks.
- **Reads your real bookmarks.** It loads the full tree with `chrome.bookmarks.getTree()`. It asks for only one permission, `bookmarks`, which it uses read-only.
- **Folder navigation.** The top-level folders (for example "Bookmarks bar" and "Other bookmarks") appear under a "Bookmarks" root. You can click into any folder, and a back button moves up through the folders you came from.
- **Clean grid.**
  - Folders are listed first, then links. Each link shows its site's favicon and title.
  - Folders that contain no links (directly or in a non-empty subfolder) are hidden.
  - Loading, error and "This folder is empty" states are handled.
- **Works outside the extension.** If the `chrome.bookmarks` API isn't available, as in a normal browser tab during `npm run dev`, the app falls back to a built-in mock bookmark tree. You can work on the UI without reloading the extension.

## Architecture

```
main.tsx ─ App ─ BookmarkGrid
                  ├─ useBookmarkNavigation()   data + navigation state
                  │    ├─ chrome.bookmarks.getTree()  (or mock data in dev)
                  │    ├─ currentFolder + navigationStack (back history)
                  │    └─ getFilteredContent()  splits a folder into subfolders and links
                  ├─ FolderHeader               title + back button
                  ├─ FolderItem                 opens a subfolder
                  └─ BookmarkItem               favicon + link
```

- **State and logic.** All state lives in the `useBookmarkNavigation` hook, and the components only render what it returns.
- **Build output.** Vite builds a static single-page app. `public/manifest.json` is copied into `dist/` next to the built `index.html`, so the folder can be loaded into Chrome as-is.
- **Network use.** The extension makes no API calls of its own and stores no data. The only outside requests are for favicons, which come from Google's favicon service (`https://www.google.com/s2/favicons?domain=…`). Each bookmarked domain is therefore sent to Google when the page renders. If a favicon fails to load, a local placeholder icon is shown instead.

## Tech stack

- React 19, TypeScript (strict mode)
- Vite 6 with `@vitejs/plugin-react`
- Tailwind CSS v4 (`@tailwindcss/vite`)
- ESLint 9 with `typescript-eslint` and the React Hooks rules
- Chrome Extensions Manifest V3 (`bookmarks` permission, new tab override)

## Repository layout

```
.
├── public/
│   ├── manifest.json          # MV3 manifest (copied into dist/ at build time)
│   └── vite.svg               # Extension icon and favicon fallback (placeholder)
├── src/
│   ├── main.tsx / App.tsx     # Entry point and page shell
│   ├── components/            # BookmarkGrid, BookmarkItem, FolderItem, FolderHeader
│   ├── hooks/                 # useBookmarkNavigation: data loading and navigation
│   ├── types/                 # Bookmark types and chrome.bookmarks declarations
│   └── index.css              # Tailwind entry
├── index.html                 # New tab page HTML (Vite entry)
├── vite.config.ts
└── eslint.config.js
```

## Getting started

### Requirements

- Node.js 20+ and npm
- Google Chrome, or another Chromium-based browser that supports Manifest V3, to load the extension

### Develop

```bash
npm install
npm run dev        # http://localhost:5173 (uses mock bookmarks)
npm run lint
```

### Build

```bash
npm run build:extension
```

This command type-checks the project (`tsc -b`), builds it into `dist/`, and makes sure `dist/manifest.json` is present.

### Load the extension in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `dist/` folder.
4. Open a new tab.

After a rebuild, click the reload icon on the extension's card in `chrome://extensions` to pick up the changes.

## Configuration

There are no environment variables or settings. To change what the extension is allowed to do or what it's called, edit `public/manifest.json`. Styling is done with Tailwind utility classes directly in the components.

## Project status

This is a small personal utility that works for everyday use. It has no automated tests and isn't published to the Chrome Web Store. The extension icon is currently the Vite placeholder logo.
