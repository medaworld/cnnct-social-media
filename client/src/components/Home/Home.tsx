import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store';
import { fetchPosts, deletePost } from '../../store/post-actions';
import { PostState } from '../../store/post-slice';
import PostFeed from '../Common/PostFeed';
import PostForm from '../Common/PostForm';

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(
    ({ postsState }: { postsState: PostState }) => postsState.posts
  );
  const hasMore = useSelector(
    ({ postsState }: { postsState: PostState }) => postsState.hasMore
  );
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchPosts(page, POSTS_PER_PAGE));
      setPage((prev) => prev + 1);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchPosts(1, POSTS_PER_PAGE));
        setError(null);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch]);

  const handleDelete = async (postId: string) => {
    try {
      await dispatch(deletePost(postId));
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Delete Failed');
    }
  };

  return (
    <div className="flex h-full min-h-screen">
      <div className="flex-1 md:p-8 bg-gray-100">
        <div className="flex flex-col p-3 border-b border-gray-300 ">
          <PostForm />
        </div>
        <div className="flex flex-col p-3">
          <PostFeed
            posts={posts}
            hasMore={hasMore}
            fetchMoreData={fetchMoreData}
            onDeletePost={handleDelete}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      {/* 
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
      </div> */}
    </div>
  );
}

export default Home;
