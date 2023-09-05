import { Link } from 'react-router-dom';
import { FaUser, FaTrash } from 'react-icons/fa';
import { Post } from '../../../store/post-slice';
import { UserState } from '../../../store/user-slice';

interface PostItemProps {
  post: Post;
  user: UserState;
  onDeletePost?: (postId: string) => void;
  openMenuPostId: string | null;
  setOpenMenuPostId: React.Dispatch<React.SetStateAction<string | null>>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const PostItem = ({
  post,
  user,
  onDeletePost,
  openMenuPostId,
  setOpenMenuPostId,
  menuRef,
}: PostItemProps) => {
  return (
    <>
      <span className="flex mt-2 mb-2 items-center justify-between">
        <div className="flex items-center">
          <Link
            to={`/${
              user.username === post.creator.username
                ? 'edit-profile'
                : post.creator.username
            }`}
            className="hover:underline"
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center flex align-items justify-content relative overflow-hidden mr-2">
                {user.username === post.creator.username &&
                user.image &&
                user.image.url ? (
                  <img
                    src={user.image.url}
                    alt="Profile"
                    className="w-8 h-8 object-cover"
                  />
                ) : post.creator.image && post.creator.image.url ? (
                  <img
                    src={post.creator.image.url}
                    alt="Profile"
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <FaUser size={20} />
                )}
              </div>
              <h4 className="text-md font-bold mr-3">
                @{post.creator.username}
              </h4>
            </span>
          </Link>

          <span className="text-xs md:text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {onDeletePost && user.username === post.creator.username && (
          <button
            className="hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full"
            onClick={() =>
              setOpenMenuPostId(post._id === openMenuPostId ? null : post._id)
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
                  setOpenMenuPostId(null);
                }}
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-lg md:ml-10 mb-2">{post.content}</p>
      {post.image.url && (
        <img
          src={post.image.url}
          alt="Post content"
          className="w-full object-contain rounded-md max-h-80 mb-2"
        />
      )}
    </>
  );
};

export default PostItem;
