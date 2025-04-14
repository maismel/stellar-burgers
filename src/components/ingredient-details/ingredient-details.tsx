import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredient,
  clearSelectedIngredient,
  getIngredients,
  getSelectedIngredient
} from '../../services/slices/ingredients/ingredientSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const selectedIngredient = useSelector(getSelectedIngredient);

  useEffect(() => {
    const ingredient = ingredients.find((i) => i._id === id);
    if (ingredient) {
      dispatch(selectIngredient(ingredient));
    }
    return () => {
      dispatch(clearSelectedIngredient());
    };
  }, [id, ingredients]);

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
