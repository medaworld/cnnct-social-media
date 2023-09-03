import { useState, useEffect } from 'react';
import Login from '../components/Home/Login';
import Home from '../components/Home/Home';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return <Home />;
  } else {
    return <Login />;
  }
}
