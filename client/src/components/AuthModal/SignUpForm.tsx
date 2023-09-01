import { useState } from 'react';

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // window.location.href = '/dashboard';
      } else if (data.message) {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-96">
      <div className="text-start mb-4 ">
        <h2 className="text-2xl font-bold">Sign Up</h2>
      </div>

      <div className="mb-4">
        <label className="sr-only">Username</label>
        <input
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Username"
        />
      </div>

      <div className="mb-4">
        <label className="sr-only">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Email"
          aria-label="Email"
        />
      </div>

      <div className="mb-4">
        <label className="sr-only">Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Password"
          aria-label="Password"
        />
      </div>

      <button
        type="submit"
        className="block w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Create Account
      </button>
    </form>
  );
}

export default SignUpForm;
