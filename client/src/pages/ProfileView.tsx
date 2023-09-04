import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import PostFeed from '../components/Common/PostFeed';
import { useDispatch } from 'react-redux';
import { deletePost } from '../store/post-actions';
import { AppDispatch } from '../store';
import { fetchUserPosts } from '../store/user-actions';
import { toast } from 'react-toastify';

export default function ProfileView() {
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useParams();
  const POSTS_PER_PAGE = 50;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState<any>({ image: {} });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await dispatch(
        fetchUserPosts(username!, page, POSTS_PER_PAGE)
      );
      setPosts(fetchedPosts.posts);
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
      if (username) {
        try {
          setIsLoading(true);
          const fetchedPosts = await dispatch(
            fetchUserPosts(username!, 1, POSTS_PER_PAGE)
          );
          setPosts(fetchedPosts.posts);
          setUser(fetchedPosts.user);
          setError(null);
        } catch (err) {
          setError('Failed to fetch posts. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [dispatch, username]);

  const handleDelete = async (postId: string) => {
    try {
      await dispatch(deletePost(postId));
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Delete Failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen space-x-1">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounceDelayed"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounceDelayed delay-100"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounceDelayed delay-200"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col p-5 bg-gray-100">
      <div className="border-b border-gray-300 p-2">
        {/* Image */}
        <div>
          <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mt-10 relative overflow-hidden">
            {user.image && user.image.url ? (
              <img
                src={user.image.url}
                alt="Profile"
                className="w-48 h-48 object-cover"
              />
            ) : (
              <FaUser size={130} />
            )}
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <h2 className="text-xl font-semibold pt-3 pb-3">@{username}</h2>
        </div>
      </div>

      <PostFeed
        posts={posts}
        hasMore={false}
        fetchMoreData={fetchMoreData}
        onDeletePost={handleDelete}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
