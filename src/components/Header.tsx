import { BitloopsUser } from 'bitloops';
import React, { FC } from 'react';

interface HeaderProps {
  user: BitloopsUser;
  logout: () => void;
}

export const Header: FC<HeaderProps> = (props): JSX.Element => {
  const { user, logout } = props;
  if (user) return (<>
    <div>Hello {user.firstName}</div>
    <button onClick={logout}>Logout</button>
  </>);
  else return (<></>);
};

export default Header;
