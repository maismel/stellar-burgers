import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients/ingredientSlice';
import {
  clearCurrentOrder,
  getFeedsAll,
  getOrdersAll,
  selectOrder
} from '../../services/slices/orders/ordersSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const orders = useSelector(getOrdersAll);
  const feeds = useSelector(getFeedsAll);
  const ingredients = useSelector(getIngredients);

  const combinedOrders = [...orders, ...feeds];

  // Найти заказ по номеру
  const orderData = useMemo(
    () => combinedOrders.find((order) => String(order.number) === number),
    [combinedOrders, number]
  );

  useEffect(() => {
    if (orderData) {
      dispatch(selectOrder(orderData));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!combinedOrders.length || !ingredients.length) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Такого заказа не найдено</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
