# Custom Home Screen Chrome Extension

A Chrome extension that replaces the new tab page with a custom home screen showing your bookmarks in a grid format.

## Features

- Custom new tab page
- Bookmarks displayed in a grid with favicons
- Responsive design using Tailwind CSS
- Built with React and TypeScript

## Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start development server:
   ```
   npm run dev
   ```

## Building the Extension

1. Build the extension:
   ```
   npm run build:extension
   ```
2. The extension will be built to the `dist` directory

## Installing in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Select the `dist` directory from this project
5. The extension should now be installed and will replace your new tab page

## Customizing

You can customize the appearance by modifying:

- `src/App.tsx` - Main layout
- `src/components/BookmarkGrid.tsx` - Bookmark display
- `tailwind.config.js` - Theme colors and other Tailwind settings

## License

MIT
