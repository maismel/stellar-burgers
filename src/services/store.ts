import { configureStore } from '@reduxjs/toolkit';
import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredients/ingredientSlice';
import { ordersSlice } from './slices/orders/ordersSlice';
import { userSlice } from './slices/user/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(ingredientsSlice, ordersSlice, userSlice);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
