function Dashboard() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <h1>Welcome!</h1>
      </div>

      <div className="w-72 p-4 bg-white shadow-md flex flex-col space-y-4">
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="Search..."
        />

        <div>
          <h2 className="text-xl font-semibold mb-2">Top 10 Trending</h2>
          <ul>
            {[...Array(10)].map((_, idx) => (
              <li key={idx} className="mb-3">
                Trending Item {idx + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
