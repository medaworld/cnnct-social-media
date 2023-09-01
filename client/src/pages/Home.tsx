import { useState, useEffect } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return <Dashboard />;
  } else {
    return <Login />;
  }
}
