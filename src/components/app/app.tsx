import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';

import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';

import { AppHeader } from '@components';
import { useEffect } from 'react';
import { checkUserAuth } from '../../services/slices/user/actions';
import { getAllFeeds } from '../../services/slices/orders/actions';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getAllFeeds());
  }, [dispatch]);

  // Если был клик по ингредиенту, location.state содержит background
  const background = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute onlyUnAuth={false}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute onlyUnAuth={false}>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => navigate('/profile/orders')}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
