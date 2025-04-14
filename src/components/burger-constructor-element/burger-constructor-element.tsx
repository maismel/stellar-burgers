import { FC, memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/ingredients/ingredientSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const itemRef = useRef<HTMLDivElement>(null);

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <div ref={itemRef}>
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
      </div>
    );
  }
);
