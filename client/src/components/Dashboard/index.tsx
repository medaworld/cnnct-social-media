import { Button } from '@material-tailwind/react';

import { FaHome, FaBell, FaEnvelope, FaUser } from 'react-icons/fa';

function Dashboard() {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/user/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.message === 'Logged out successfully') {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 p-4 bg-white shadow-md flex flex-col">
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <FaHome />
            <span>Home</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaBell />
            <span>Notifications</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope />
            <span>Messages</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaUser />
            <span>Profile</span>
          </div>

          <Button color="blue">Post</Button>

          <div className="mt-auto"></div>
        </div>
        <Button color="red" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="flex-1 p-6">
        <h1>Welcome!</h1>
      </div>
    </div>
  );
}

export default Dashboard;