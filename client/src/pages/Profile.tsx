import { FaUser } from 'react-icons/fa';
import PostFeed from '../components/Common/PostFeed';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../store/user-slice';
import { useEffect, useState } from 'react';
import { deletePost } from '../store/post-actions';
import { AppDispatch } from '../store';
import { fetchUserPosts } from '../store/user-actions';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    ({ userState }: { userState: UserState }) => userState
  );
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchUserPosts(user.username!, page, POSTS_PER_PAGE));
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
      if (user.username) {
        try {
          setIsLoading(true);
          await dispatch(fetchUserPosts(user.username!, 1, POSTS_PER_PAGE));
          setError(null);
        } catch (err) {
          setError('Failed to fetch posts. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [dispatch, user.username]);

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
    <div className="w-full h-full min-h-screen flex flex-col p-10 bg-gray-100">
      {user.image.url ? (
        <img
          src={''}
          alt="Profile"
          className="w-48 h-48 rounded-full object-cover mt-10"
        />
      ) : (
        <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mt-10">
          <FaUser size={130} />
        </div>
      )}

      <h2 className="mt-4 text-xl font-semibold">@{user.username}</h2>

      <PostFeed
        posts={user.posts}
        hasMore={false}
        fetchMoreData={fetchMoreData}
        onDeletePost={handleDelete}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
