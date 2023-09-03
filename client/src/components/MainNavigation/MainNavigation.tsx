import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

import { FaHome, FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import { useRouteLoaderData } from 'react-router-dom';
import CustomModal from '../CustomModal';
import PostForm from '../PostForm/PostForm';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import { toast } from 'react-toastify';

export default function MainNavigation() {
  const [showModal, setShowModal] = useState(false);
  useRouteLoaderData('root');

  const handleLogout = async () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('expiration');
      toast.success('Logout Successful');
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout Failed');
      console.error('Error during logout:', error);
    }
  };
  return (
    <>
      <div className="w-72 p-4 bg-white shadow-md flex flex-col h-screen sticky top-0">
        <div className="flex-1 flex flex-col space-y-4">
          <img
            src={logo}
            alt="cnnct logo"
            className="mb-4 w-32 mx-auto md:mx-0"
          />
          <Link
            to="/"
            className="flex items-center space-x-4 text-xl hover:bg-gray-100 p-2 rounded"
          >
            <FaHome className="text-2xl" />
            <span>Home</span>
          </Link>
          <Link
            to="/notifications"
            className="flex items-center space-x-4 text-xl hover:bg-gray-100 p-2 rounded"
          >
            <FaBell className="text-2xl" />
            <span>Notifications</span>
          </Link>
          <Link
            to="/messages"
            className="flex items-center space-x-4 text-xl hover:bg-gray-100 p-2 rounded"
          >
            <FaEnvelope className="text-2xl" />
            <span>Messages</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center space-x-4 text-xl hover:bg-gray-100 p-2 rounded"
          >
            <FaUser className="text-2xl" />
            <span>Profile</span>
          </Link>
          <Button color="blue" onClick={() => setShowModal(true)}>
            Post
          </Button>

          <div className="mt-auto"></div>
        </div>
        <Button color="white" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <PostForm setClose={setShowModal} />
      </CustomModal>
    </>
  );
}
