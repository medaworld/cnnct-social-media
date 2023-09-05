import { useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { Form } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { compressImage } from '../../../utils/imageUtils';
import { addPost } from '../../../store/post-actions';
import { AppDispatch } from '../../../store';

export default function PostForm({
  setClose,
}: {
  setClose?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formImage, setFormImage] = useState<FormData>();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
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

  const handleImageClose = () => {
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(addPost(inputValue, formImage));
      if (result) {
        setInputValue('');
        setImagePreviewUrl(null);
        setFormImage(undefined);
        setClose && setClose(false);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <input
          className="flex-grow p-2 border rounded mb-3 "
          type="text"
          placeholder="Write your post..."
          maxLength={500}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p>{500 - inputValue.length} characters remaining</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="mr-2">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <FaImage
            onClick={handleImageClick}
            className="cursor-pointer hover:bg-gray-300"
            size={20}
          />
        </div>

        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Post
        </button>
      </div>

      {imagePreviewUrl && (
        <div className="relative mt-3 mx-auto max-w-xs">
          <img
            src={imagePreviewUrl}
            alt="Selected preview"
            className="rounded"
          />
          <button
            onClick={handleImageClose}
            className="absolute top-0 right-0 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-800"
          >
            &times;
          </button>
        </div>
      )}
    </Form>
  );
}
