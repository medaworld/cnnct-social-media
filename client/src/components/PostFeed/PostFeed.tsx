import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { Post, PostState } from '../../store/post-slice';
import { fetchPosts } from '../../store/post-actions';
import { AppDispatch } from '../../store';

export default function PostFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const posts = useSelector((state: PostState) => state.posts);
  const hasMore = useSelector((state: PostState) => state.hasMore);

  console.log(hasMore);

  useEffect(() => {
    dispatch(fetchPosts(page, POSTS_PER_PAGE));
  }, [dispatch, page]);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      {posts.map((post: Post) => (
        <div key={post._id} className="post p-4 border-b border-gray-300">
          <span className="flex mb-2 items-center">
            <h4 className="text-md font-bold mr-3">@{post.creator.username}</h4>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleTimeString()}
              {' - '}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </span>
          <p className="text-lg mb-2">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full object-contain rounded-md max-h-80 mb-2"
            />
          )}
        </div>
      ))}
    </InfiniteScroll>
  );
}
