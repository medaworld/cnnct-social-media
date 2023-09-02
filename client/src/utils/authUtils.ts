import { redirect } from 'react-router-dom';

export function getAuthToken() {
  const token = localStorage.getItem('authToken');
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return redirect('/');
  }

  return null;
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  const expirationDate = new Date(storedExpirationDate!);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}
