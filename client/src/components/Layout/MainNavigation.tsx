import { Button } from '@material-tailwind/react';
import { FaHome, FaEnvelope, FaUser, FaPencilAlt } from 'react-icons/fa';
import { useRouteLoaderData } from 'react-router-dom';
import CustomModal from '../Common/CustomModal';
import PostForm from '../Common/PostForm';
import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logoutUser } from '../../store/user-actions';
import { AppDispatch } from '../../store';
import { UserState } from '../../store/user-slice';
import CustomNavLink from '../Common/CustomNavLink';

export default function MainNavigation() {
  useRouteLoaderData('root');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    ({ userState }: { userState: UserState }) => userState
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

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

  const handleOutsideClick = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenu(false);
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
      <div className="w-20 md:w-72 p-4 bg-white shadow-md flex flex-col h-screen sticky top-0">
        <div className="flex-1 flex flex-col space-y-4">
          <img
            src={logo}
            alt="cnnct logo"
            className="mb-4 w-24 md:w-32 mx-auto md:mx-0"
          />
          <CustomNavLink
            to="/"
            className="flex justify-center items-center md:justify-start space-x-4 text-xl p-2 rounded"
          >
            <FaHome className="text-2xl" />
            <span className="hidden md:inline">Home</span>
          </CustomNavLink>
          <CustomNavLink
            to="/messages"
            className="flex justify-center items-center md:justify-start space-x-4 text-xl p-2 rounded"
          >
            <FaEnvelope className="text-2xl" />
            <span className="hidden md:inline">Messages</span>
          </CustomNavLink>
          <CustomNavLink
            to="/edit-profile"
            className="flex justify-center items-center md:justify-start space-x-4 text-xl p-2 rounded"
          >
            <FaUser className="text-2xl" />
            <span className="hidden md:inline">Profile</span>
          </CustomNavLink>
          <Button
            className="text-base flex justify-center p-2"
            color="blue"
            onClick={() => setShowModal(true)}
          >
            <FaPencilAlt />
            <span className="hidden md:inline ml-2">Post</span>
          </Button>

          <div className="mt-auto"></div>
        </div>
        <div className="relative w-full">
          <Button
            color="white"
            className="w-full normal-case flex justify-center p-2"
            onClick={() => setOpenMenu(true)}
          >
            <span className="flex items-center text-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center flex align-items justify-content relative overflow-hidden md:mr-2">
                {user.image && user.image.url ? (
                  <img
                    src={user.image.url}
                    alt="Profile"
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <FaUser size={20} />
                )}
              </div>
              <span className="hidden md:inline">
                {user.username && `@${user.username}`}
              </span>
            </span>
          </Button>

          {openMenu && (
            <div
              ref={menuRef}
              className="absolute bottom-12 w-full bg-white border rounded shadow-lg"
            >
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 text-red-500 flex items-center"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <PostForm setClose={setShowModal} />
      </CustomModal>
    </>
  );
}
