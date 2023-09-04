import { NavLink, useLocation } from 'react-router-dom';

export default function CustomNavLink(props: any) {
  const location = useLocation();

  let match = false;

  if (props.to === '/') {
    match = location.pathname === '/';
  } else {
    match = location.pathname.includes(props.to);
  }

  return (
    <NavLink
      {...props}
      className={
        (match ? 'bg-gray-300 ' : 'hover:bg-gray-100 ') +
        (props.className || '')
      }
    />
  );
}
