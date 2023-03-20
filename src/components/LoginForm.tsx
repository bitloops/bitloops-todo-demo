import React, { useEffect, useState } from 'react';

interface GoogleButtonProps {
  loginWithEmailPassword: (email: string, password: string) => void;
}

function LoginForm(props: GoogleButtonProps) {
  const { loginWithEmailPassword } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
  }, []);
  return (<div style={{
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    marginLeft: 'calc(50% - 125px)',
  }}>
    <div style={{fontFamily: 'sans-serif', marginBottom: '30px'}}>You are viewing public demo todos. To create and view your own please login.</div>
    <form>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          position: 'relative',
          background: '#fff',
          borderColor: '#cbd4db',
          color: '#273240',
          fill: '#6f7782',
          fontSize: '16px',
          height: '48px',
          lineHeight: '48px',
          padding: '0 16px',
          cursor: 'pointer',
          alignSelf: 'stretch',
          marginBottom: '32px',
          alignItems: 'center',
          border: '1px solid',
          borderRadius: '2px',
          boxSizing: 'border-box',
          display: 'inline-flex',
          flexShrink: 0,
          justifyContent: 'center',
          overflow: 'hidden',
          transitionDuration: '.2s',
          transitionProperty: 'background,border,box-shadow,color,fill',
          userSelect: 'none',
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          position: 'relative',
          background: '#fff',
          borderColor: '#cbd4db',
          color: '#273240',
          fill: '#6f7782',
          fontSize: '16px',
          height: '48px',
          lineHeight: '48px',
          padding: '0 16px',
          cursor: 'pointer',
          alignSelf: 'stretch',
          marginBottom: '32px',
          alignItems: 'center',
          border: '1px solid',
          borderRadius: '2px',
          boxSizing: 'border-box',
          display: 'inline-flex',
          flexShrink: 0,
          justifyContent: 'center',
          overflow: 'hidden',
          transitionDuration: '.2s',
          transitionProperty: 'background,border,box-shadow,color,fill',
          userSelect: 'none',
        }}
      />
    </form>
    <button
      onClick={() => loginWithEmailPassword(email, password)}
      type="button"
      style={{
        position: 'relative',
        background: '#fff',
        borderColor: '#cbd4db',
        color: '#273240',
        fill: '#6f7782',
        fontSize: '16px',
        height: '48px',
        lineHeight: '48px',
        padding: '0 16px',
        cursor: 'pointer',
        alignSelf: 'stretch',
        marginBottom: '32px',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: '2px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        flexShrink: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        transitionDuration: '.2s',
        transitionProperty: 'background,border,box-shadow,color,fill',
        userSelect: 'none',
        // '&:hover': {
        //   backgroundColor: '#f2f3f5',
        // }
      }}
    >
      Login
    </button>
  </div>);
}

export default LoginForm;
