import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { getTokenDuration } from '../utils/authUtils';
import MainNavigation from '../components/Layout/MainNavigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout() {
  const token = useLoaderData();
  useEffect(() => {
    if (!token) {
      return;
    }

    const tokenDuration = getTokenDuration();
    setTimeout(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('expiration');
      window.location.href = '/';
    }, tokenDuration);
  }, [token]);

  const navigation = token ? <MainNavigation /> : '';

  return (
    <div className="flex justify-center h-full bg-gray-100">
      <div className="flex max-w-screen-2xl w-full h-full">
        {navigation}
        <main className="w-full h-full">
          <ToastContainer />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
