// этот файл полностью готов
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getUser,
  getIsAuthChecked
} from '../../services/slices/user/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};
