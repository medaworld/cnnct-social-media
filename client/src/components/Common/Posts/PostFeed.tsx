import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Post } from '../../../store/post-slice';
import { useSelector } from 'react-redux';
import { UserState } from '../../../store/user-slice';
import Loader from '../Loader';
import Error from '../Error';
import PostItem from './PostItem';

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Error
        fetchMoreData={fetchMoreData}
        error={error}
        isLoading={isLoading}
      />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore && !error}
        loader={<h4>Loading...</h4>}
      >
        {posts.map((post: Post) => (
          <div
            key={post._id}
            className="post relative md:p-4 border-b border-gray-300"
          >
            <PostItem
              post={post}
              user={user}
              onDeletePost={onDeletePost}
              openMenuPostId={openMenuPostId}
              setOpenMenuPostId={setOpenMenuPostId}
              menuRef={menuRef}
            />
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
