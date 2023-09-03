import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/user-actions';
import { Form } from 'react-router-dom';
import { AppDispatch } from '../../store';

function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(formData));
      if (result) {
        setFormData({ username: '', email: '', password: '' });
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
    <Form onSubmit={handleSubmit} className="w-full">
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
    </Form>
  );
}

export default RegisterForm;
