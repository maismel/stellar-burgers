import {
  getOrdersApi,
  orderBurgerApi,
  getFeedsApi,
  getOrderByNumberApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getAllFeeds = createAsyncThunk<TOrder[]>(
  'feeds/getAll',
  async () => {
    const response = await getFeedsApi(); // Получаем объект TFeedsResponse
    console.log('API Response:', response);
    return response.orders;
  }
);

export const makeOrder = createAsyncThunk(
  'orders/create',
  async (data: string[]) => {
    const order = await orderBurgerApi(data);
    return order;
  }
);

export const getAllOrders = createAsyncThunk('orders/getAll', async () => {
  const response = await getOrdersApi();
  return response;
});

export const getOrderByNumber = createAsyncThunk(
  'getOrders/byNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);
