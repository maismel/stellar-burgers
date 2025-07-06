import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersAll } from '../../services/slices/orders/ordersSlice';
import { getAllOrders } from '../../services/slices/orders/actions';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
  }, []);
  const orders = useSelector(getOrdersAll);

  return <ProfileOrdersUI orders={orders} />;
};
