import PostFeed from '../PostFeed/PostFeed';
import PostForm from '../PostForm/PostForm';

function Dashboard() {
  return (
    <div className="flex h-full min-h-screen">
      <div className="flex-1 p-8 bg-gray-100">
        <div className="flex flex-col p-3 border-b border-gray-300 ">
          <PostForm />
        </div>
        <div className="flex flex-col p-3">
          <PostFeed />
        </div>
      </div>

      <div className="w-72 p-4 bg-white shadow-md flex flex-col space-y-4 h-screen sticky top-0 hidden lg:block">
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
