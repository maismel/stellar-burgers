import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getIngredientsInOrder } from '../../services/slices/ingredients/ingredientSlice';

// это тоже полностью готово

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const ingredientsInOrder = useSelector(getIngredientsInOrder);

  const bun = ingredientsInOrder.find(
    (ingredient: TConstructorIngredient) => ingredient.type === 'bun'
  );

  const ingredientsExceptBuns = ingredientsInOrder.filter(
    (ingredient: TConstructorIngredient) => ingredient.type !== 'bun'
  );

  const burgerConstructor = {
    bun: {
      _id: bun?._id
    },
    ingredients: ingredientsExceptBuns
  };

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun?._id) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
