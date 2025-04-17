import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { getFeedsAll } from '../../services/slices/orders/ordersSlice';
import { getAllFeeds } from '../../services/slices/orders/actions';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  dispatch(getAllFeeds());

  const orders = useSelector(getFeedsAll);
  console.log('Orders from store:', orders);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getAllFeeds());
      }}
    />
  );
};
