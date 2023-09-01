import { useState } from 'react';
import AuthModal from '../AuthModal';
import logo from '../../assets/logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('hello');
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        window.location.href = '/';
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex-1 max-w-4xl mx-6 md:mx-0 bg-white shadow-md rounded-md p-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="flex-1 p-4">
            <img
              src={logo}
              alt="cnnct logo"
              className="mb-4 w-32 mx-auto md:mx-0"
            />
            <p className="text-xl font-bold">Connect with your friends!</p>
          </div>

          {/* Right Section */}
          <div className="flex-1 p-4">
            <h2 className="text-2xl mb-4">Sign in to cnnct</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              >
                Sign in
              </button>
            </form>
            <button
              className="mt-4 block w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded"
              onClick={() => setShowModal(true)}
            >
              Create account
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default Login;
