import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

type Post = {
  _id: string;
  creator: { username: string };
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

export default function PostFeed() {
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const currentSkip = (page - 1) * POSTS_PER_PAGE;

  useEffect(() => {
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async () => {
    const graphqlQuery = {
      query: `
              {
                  posts(skip: ${
                    (page - 1) * POSTS_PER_PAGE
                  }, limit: ${POSTS_PER_PAGE}) {
                      posts {
                          _id
                          content
                          imageUrl
                          creator {
                              username
                          }
                          createdAt
                      }
                      totalPosts
                  }
              }
          `,
    };
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });
      const data = await response.json();

      if (
        data.data.posts.posts.length < POSTS_PER_PAGE ||
        data.data.posts.totalPosts <= currentSkip + data.data.posts.posts.length
      ) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...data.data.posts.posts]);
      setPage(page + 1); // directly use the current value of page
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      {posts.map((post) => (
        <div key={post._id} className="post p-4 border-b border-gray-300">
          <span className="flex mb-2">
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
              className="w-full object-cover rounded-md max-h-60 mb-2"
            />
          )}
        </div>
      ))}
    </InfiniteScroll>
  );
}
