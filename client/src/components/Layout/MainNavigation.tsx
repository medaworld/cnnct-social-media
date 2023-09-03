import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

import { FaHome, FaEnvelope, FaUser } from 'react-icons/fa';
import { useRouteLoaderData } from 'react-router-dom';
import CustomModal from '../Common/CustomModal';
import PostForm from '../Common/PostForm';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logoutUser } from '../../store/user-actions';
import { AppDispatch } from '../../store';
import { UserState } from '../../store/user-slice';

export default function MainNavigation() {
  useRouteLoaderData('root');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    ({ userState }: { userState: UserState }) => userState
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchUser());
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logoutUser());
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
            to="/messages"
            className="flex items-center space-x-4 text-xl hover:bg-gray-100 p-2 rounded"
          >
            <FaEnvelope className="text-2xl" />
            <span>Messages</span>
          </Link>
          <Link
            to="/edit-profile"
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
        <span className="flex items-center space-x-4 text-lg  p-2 rounded">
          {user.username && `@${user.username}`}
        </span>
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
