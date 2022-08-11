// import { BitloopsUser } from 'bitloops';
import React from 'react';
import { UserData } from '../infra/auth';

interface HeaderProps {
  user?: UserData; //BitloopsUser;
  logout: () => void;
}

function Header(props: HeaderProps) {
  const { user, logout } = props;
  if (user)
    return (
      <>
        <div>Hello {user?.displayName}</div>
        <button onClick={logout} type="submit">
          Logout
        </button>
      </>
    );
  return null;
}

export default Header;
