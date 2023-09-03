import { NavLink, useMatch } from 'react-router-dom';

export default function CustomNavLink(props: any) {
  const match = useMatch(props.to);
  return (
    <NavLink
      {...props}
      className={
        (match ? 'bg-gray-200 ' : 'hover:bg-gray-100 ') +
        (props.className || '')
      }
    />
  );
}
