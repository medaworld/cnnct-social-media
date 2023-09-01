import { useState } from 'react';

function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthday: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

        window.location.href = '/dashboard';
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
    <form onSubmit={handleSubmit}>
      <div className="text-start mb-4">
        <h2 className="text-2xl font-bold">Sign Up</h2>
      </div>

      <div className="flex mb-4 space-x-4">
        <div className="flex-1">
          <label className="sr-only">First Name</label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="First Name"
          />
        </div>

        <div className="flex-1">
          <label className="sr-only">Last Name</label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Last Name"
          />
        </div>
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

      <div className="mb-4">
        <label>Birthday</label>
        <input
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Birthday"
          aria-label="Birthday"
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
