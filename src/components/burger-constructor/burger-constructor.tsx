import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/user/userSlice';
import {
  getIngredientsInOrder,
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
  const ingredientsForOrder = ingredientsInOrder.map(
    (ingredient) => ingredient._id
  );

  const bun = ingredientsInOrder.find(
    (ingredient: TConstructorIngredient) => ingredient.type === 'bun'
  );
  const ingredientsExceptBuns = ingredientsInOrder.filter(
    (ingredient: TConstructorIngredient) => ingredient.type !== 'bun'
  );

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredientsExceptBuns
  };

  const currentOrder = useSelector(getCurrentOrder);
  const orderRequest = useSelector(getCurrentOrderLoading);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    if (user) {
      dispatch(makeOrder(ingredientsForOrder));
      setIsOpen(true);
    }
  };

  const closeOrderModal = () => {
    setIsOpen(false);
    dispatch(clearIngredients());
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [ingredientsExceptBuns]
  );

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
