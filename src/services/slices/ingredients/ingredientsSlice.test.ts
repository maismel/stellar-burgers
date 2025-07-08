import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearIngredients
} from './ingredientSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const baseIngredient: TIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      ingredients: [],
      ingredientsInOrder: [],
      bun: null,
      selectedIngredient: null,
      loading: false,
      error: null
    });
  });

  it('should handle addIngredient', () => {
    const state = reducer(undefined, addIngredient(baseIngredient));
    expect(state.ingredientsInOrder.length).toBe(1);
    expect(state.ingredientsInOrder[0]).toMatchObject(baseIngredient);
    expect(state.ingredientsInOrder[0]).toHaveProperty('id');
  });

  it('should handle removeIngredient', () => {
    const addedState = reducer(undefined, addIngredient(baseIngredient));
    const idToRemove = addedState.ingredientsInOrder[0].id;

    const removedState = reducer(addedState, removeIngredient(idToRemove));
    expect(removedState.ingredientsInOrder.length).toBe(0);
  });

  it('should handle moveIngredient', () => {
    const stateWithTwo = [addIngredient(baseIngredient), addIngredient({ ...baseIngredient, _id: '2' })].reduce(
      reducer,
      undefined
    );

    const firstId = stateWithTwo?.ingredientsInOrder[0].id;
    const secondId = stateWithTwo?.ingredientsInOrder[1].id;

    const movedState = reducer(stateWithTwo, moveIngredient({ fromIndex: 0, toIndex: 1 }));

    expect(movedState.ingredientsInOrder[0].id).toBe(secondId);
    expect(movedState.ingredientsInOrder[1].id).toBe(firstId);
  });

  it('should handle clearIngredients', () => {
    let state = reducer(undefined, addIngredient(baseIngredient));
    state = reducer(state, clearIngredients());
    expect(state.ingredientsInOrder).toEqual([]);
    expect(state.bun).toBeNull();
  });
});
