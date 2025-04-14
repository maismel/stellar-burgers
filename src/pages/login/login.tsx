import { FC, SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { loginUser } from '../../services/slices/user/actions';
import { getUser } from '../../services/slices/user/userSlice';

// так, тут вероятней всего надо еще с паролем намутить

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    return <Navigate to={'/'} />;
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
