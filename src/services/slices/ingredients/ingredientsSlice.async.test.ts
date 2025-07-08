import reducer from './ingredientSlice';
import { getAllIngredientsApi } from './actions';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice extraReducers', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Mock Ingredient',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 100,
      price: 50,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  it('should handle getAllIngredientsApi.pending', () => {
    const action = { type: getAllIngredientsApi.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getAllIngredientsApi.fulfilled', () => {
    const action = {
      type: getAllIngredientsApi.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(undefined, action);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
  });

  it('should handle getAllIngredientsApi.rejected', () => {
    const action = {
      type: getAllIngredientsApi.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });
});
