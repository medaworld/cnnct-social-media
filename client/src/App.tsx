import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import MessagingPage from './pages/Messaging';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    children: [
      { index: true, element: <HomePage /> },
      { path: '/messaging', element: <MessagingPage /> },
      // {
      //   path: 'auth',
      //   element: <AuthenticationPage />,
      //   action: authAction,
      // },
      // {
      //   path: 'logout',
      //   action: logoutAction,
      // },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
