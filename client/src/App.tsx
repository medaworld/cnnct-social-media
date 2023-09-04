import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import MessagesLayout from './pages/MessagesLayout';
import { checkAuthLoader, tokenLoader } from './utils/authUtils';
import ProfileEdit from './pages/ProfileEdit';
import ProfileView from './pages/ProfileView';
import MessagesChat from './components/Messages/MessagesChat';
import MessageList from './components/Messages/MessagesList';
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
        element: <MessagesLayout />,
        loader: checkAuthLoader,
        children: [
          { index: true, element: <MessageList /> },
          { path: ':conversationId', element: <MessagesChat /> },
        ],
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
