export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error:</h1>
        <p className="text-xl mb-4">An error occurred</p>
        <p className="mb-4 text-gray-600">
          The page you're looking for cannot be found.
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
