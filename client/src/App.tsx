import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import MessagingPage from './pages/Messaging';
import { checkAuthLoader, tokenLoader } from './utils/authUtils';
import ProfileEdit from './pages/ProfileEdit';
import ProfileView from './pages/ProfileView';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/messages',
        element: <MessagingPage />,
        loader: checkAuthLoader,
      },
      {
        path: '/edit-profile',
        element: <ProfileEdit />,
        loader: checkAuthLoader,
      },
      {
        path: '/:username',
        element: <ProfileView />,
        loader: checkAuthLoader,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
