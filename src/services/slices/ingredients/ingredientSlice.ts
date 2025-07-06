import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getAllIngredientsApi } from './actions';

type TIngredientsState = {
  ingredients: TIngredient[];
  ingredientsInOrder: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
  selectedIngredient: TIngredient | null;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  ingredientsInOrder: [],
  bun: null,
  selectedIngredient: null,
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredientsInOrder.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id: string = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredientsInOrder = state.ingredientsInOrder.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    selectIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    },
    clearIngredients: (state) => {
      state.ingredientsInOrder = [];
      state.bun = null;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const items = state.ingredientsInOrder;

      if (toIndex < 0 || toIndex >= items.length) return;

      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
    }
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsInOrder: (state) => state.ingredientsInOrder,
    getBun: (state) => state.bun,
    getSelectedIngredient: (state) => state.selectedIngredient,
    getLoadingStatus: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIngredientsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllIngredientsApi.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllIngredientsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export default ingredientsSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  selectIngredient,
  clearSelectedIngredient,
  clearIngredients,
  moveIngredient
} = ingredientsSlice.actions;

export const {
  getIngredients,
  getIngredientsInOrder,
  getBun,
  getSelectedIngredient,
  getLoadingStatus
} = ingredientsSlice.selectors;
