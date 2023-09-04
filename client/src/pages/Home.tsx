import { useState, useEffect } from 'react';
import Login from '../components/Home/Login';
import Home from '../components/Home/Home';
import { getAuthToken } from '../utils/authUtils';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
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
