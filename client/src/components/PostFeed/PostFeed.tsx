import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { Post, PostState } from '../../store/post-slice';
import { deletePost, fetchPosts } from '../../store/post-actions';
import { AppDispatch } from '../../store';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PostFeed() {
  const POSTS_PER_PAGE = 50;

  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: PostState) => state.posts);
  const hasMore = useSelector((state: PostState) => state.hasMore);

  const menuRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
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

  const handleOutsideClick = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuPostId(null);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await dispatch(deletePost(postId));
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Delete Failed');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      {error && !isLoading && (
        <>
          <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>
          <div className="flex justify-center items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded shadow-lg focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              onClick={fetchMoreData}
            >
              Refresh
            </button>
          </div>
        </>
      )}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore && !error}
        loader={<h4>Loading...</h4>}
      >
        {posts.map((post: Post) => (
          <div
            key={post._id}
            className="post relative p-4 border-b border-gray-300"
          >
            <span className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <Link
                  to={`/${post.creator.username}`}
                  className="hover:underline"
                >
                  <h4 className="text-md font-bold mr-3">
                    @{post.creator.username}
                  </h4>
                </Link>

                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleTimeString()}
                  {' - '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full"
                onClick={() =>
                  setOpenMenuPostId(
                    post._id === openMenuPostId ? null : post._id
                  )
                }
              >
                ...
              </button>
            </span>

            {openMenuPostId === post._id && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-0 w-48 bg-white border rounded shadow-lg"
              >
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 text-red-500 flex items-center"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            <p className="text-lg mb-2">{post.content}</p>
            {post.image.url && (
              <img
                src={post.image.url}
                alt="Post content"
                className="w-full object-contain rounded-md max-h-80 mb-2"
              />
            )}
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
