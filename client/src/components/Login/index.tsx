import { useState } from 'react';
import logo from '../../assets/logo.png';
import CustomModal from '../CustomModal';
import SignUpForm from '../Register/RegisterForm';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  // GraphQL
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const graphqlQuery = {
      query: `
         {
          login(username:"${username}",  password:"${password}") {
            token
            _id
          }
        }
      `,
    };

    try {
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      const data = await response.json();

      const { token } = data.data.login;
      if (token) {
        localStorage.setItem('authToken', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        return (window.location.href = '/');
      } else {
        console.error(data.errors.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // API
  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch('http://localhost:8080/user/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     const data = await response.json();

  //     if (data.token) {
  //       localStorage.setItem('authToken', data.token);
  //       const expiration = new Date();
  //       expiration.setHours(expiration.getHours() + 1);
  //       localStorage.setItem('expiration', expiration.toISOString());
  //       return (window.location.href = '/');
  //     } else {
  //       console.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //   }
  // };

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
            <h2 className="text-2xl mb-4">Sign in</h2>
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

      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <SignUpForm />
      </CustomModal>
    </div>
  );
}

export default Login;
