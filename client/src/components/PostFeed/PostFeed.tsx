import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { Post, PostState } from '../../store/post-slice';
import { deletePost, fetchPosts } from '../../store/post-actions';
import { AppDispatch } from '../../store';
import { FaTrash } from 'react-icons/fa';

export default function PostFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const posts = useSelector((state: PostState) => state.posts);
  const hasMore = useSelector((state: PostState) => state.hasMore);
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts(page, POSTS_PER_PAGE));
  }, [dispatch, page]);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

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
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  console.log(posts);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      {posts.map((post: Post) => (
        <div
          key={post._id}
          className="post relative p-4 border-b border-gray-300"
        >
          <span className="flex mb-2 items-center justify-between">
            <div className="flex items-center">
              <h4 className="text-md font-bold mr-3">
                @{post.creator.username}
              </h4>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleTimeString()}
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full"
              onClick={() =>
                setOpenMenuPostId(post._id === openMenuPostId ? null : post._id)
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
  );
}
