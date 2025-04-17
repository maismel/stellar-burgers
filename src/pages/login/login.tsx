import { FC, SyntheticEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { loginUser } from '../../services/slices/user/actions';
import { getUser } from '../../services/slices/user/userSlice';

// так, тут вероятней всего надо еще с паролем намутить

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();

  const dispatch = useDispatch();

  const user = useSelector(getUser);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  if (user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname || '/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
