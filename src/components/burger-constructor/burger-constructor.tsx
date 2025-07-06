import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/user/userSlice';
import {
  getIngredientsInOrder,
  getBun,
  clearIngredients
} from '../../services/slices/ingredients/ingredientSlice';
import {
  getCurrentOrder,
  getCurrentOrderLoading,
  clearCurrentOrder
} from '../../services/slices/orders/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { makeOrder } from '../../services/slices/orders/actions';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector(getUser);
  const ingredientsInOrder = useSelector(getIngredientsInOrder);
  const bun = useSelector(getBun);

  const ingredientsForOrder = [
    ...(bun ? [bun._id] : []),
    ...ingredientsInOrder.map((ingredient) => ingredient._id),
    ...(bun ? [bun._id] : [])
  ];

  const currentOrder = useSelector(getCurrentOrder);
  const orderRequest = useSelector(getCurrentOrderLoading);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;

    dispatch(makeOrder(ingredientsForOrder));
    setIsOpen(true);
  };

  const closeOrderModal = () => {
    setIsOpen(false);
    dispatch(clearIngredients());
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredientsInOrder.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredientsInOrder]);

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredientsInOrder
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={isOpen ? currentOrder : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isLoading={orderRequest || false}
    />
  );
};
