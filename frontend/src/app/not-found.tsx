export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl mb-4">Page Not Found</p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

