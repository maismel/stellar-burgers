import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getAllIngredientsApi = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  getIngredientsApi
);
