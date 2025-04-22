import BookmarkGrid from "./components/BookmarkGrid";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800">My Custom Home</h1>
      </header>

      <main className="container mx-auto">
        <BookmarkGrid />
      </main>
    </div>
  );
}

export default App;
