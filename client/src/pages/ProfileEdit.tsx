import { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import PostFeed from '../components/Common/PostFeed';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../store/user-slice';
import { deletePost } from '../store/post-actions';
import { AppDispatch } from '../store';
import { addUserImage, fetchUserPosts } from '../store/user-actions';
import { toast } from 'react-toastify';
import { compressImage } from '../utils/imageUtils';
import { Button } from '@material-tailwind/react';
import { Form } from 'react-router-dom';

export default function ProfileEdit() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    ({ userState }: { userState: UserState }) => userState
  );
  const POSTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formImage, setFormImage] = useState<FormData>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: file.lastModified,
      });

      const formData = new FormData();
      formData.append('image', compressedFile);
      setFormImage(formData);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await dispatch(addUserImage(formImage));
      if (result) {
        setImagePreviewUrl(null);
        setFormImage(undefined);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col p-5 bg-gray-100">
      <Form onSubmit={handleSubmit} className="border-b border-gray-300 p-2">
        {/* Image */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
          />

          <div
            onClick={handleImageClick}
            className="w-48 h-48 rounded-full bg-gray-200 cursor-pointer flex items-center justify-center mt-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white opacity-0 hover:opacity-50 transition-opacity">
              Change Photo
            </div>

            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-48 h-48 object-cover"
              />
            ) : user.image && user.image.url ? (
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
          <h2 className="text-xl font-semibold pt-3 pb-3">@{user.username}</h2>
          {imagePreviewUrl && (
            <Button className="w-fit" type="submit">
              Save Changes
            </Button>
          )}
        </div>
      </Form>

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
