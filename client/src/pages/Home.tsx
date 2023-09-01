import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import logo from '../assets/logo.png';
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

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
            <form>
              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Password</label>
                <input
                  type="password"
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
