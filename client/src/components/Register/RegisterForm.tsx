import { useState } from 'react';
import { json, useNavigation } from 'react-router-dom';

function RegisterForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // GraphQL
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const graphqlQuery = {
      query: `
        mutation {
          createUser(userInput: {username:"${formData.username}", email:"${formData.email}", password:"${formData.password}"}) {
            _id
            token
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

      if (response.status === 422 || response.status === 400) {
        return response;
      }

      if (!response.ok) {
        throw json(
          { message: 'Could not authenticate user.' },
          { status: 500 }
        );
      }

      const data = await response.json();

      const { token } = data.data.createUser;
      if (token) {
        localStorage.setItem('authToken', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        window.location.href = '/';
      } else if (data.message) {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // API
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:8080/user/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.status === 422 || response.status === 400) {
  //       return response;
  //     }

  //     if (!response.ok) {
  //       throw json(
  //         { message: 'Could not authenticate user.' },
  //         { status: 500 }
  //       );
  //     }

  //     const data = await response.json();
  //     const token = data.token;
  //     if (token) {
  //       localStorage.setItem('authToken', token);
  //       const expiration = new Date();
  //       expiration.setHours(expiration.getHours() + 1);
  //       localStorage.setItem('expiration', expiration.toISOString());
  //       window.location.href = '/';
  //     } else if (data.message) {
  //       console.log(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error registering user:', error);
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Create Account'}
      </button>
    </form>
  );
}

export default RegisterForm;
