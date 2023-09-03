import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Post } from '../../store/post-slice';

import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserState } from '../../store/user-slice';

interface PostFeedProps {
  posts: Post[];
  hasMore: boolean;
  fetchMoreData: () => void;
  onDeletePost?: (postId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function PostFeed({
  posts,
  hasMore,
  fetchMoreData,
  onDeletePost,
  isLoading = true,
  error = null,
}: PostFeedProps) {
  const user = useSelector(
    ({ userState }: { userState: UserState }) => userState
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  const handleOutsideClick = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenuPostId(null);
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
              {onDeletePost && user.username === post.creator.username && (
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
              )}
            </span>

            {openMenuPostId === post._id && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-0 w-48 bg-white border rounded shadow-lg"
              >
                <div className="py-1">
                  {onDeletePost && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 text-red-500 flex items-center"
                      onClick={() => {
                        onDeletePost(post._id);
                        setOpenMenuPostId(null); // Close the menu after deleting
                      }}
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  )}
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
