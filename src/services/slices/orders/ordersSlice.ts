import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getAllFeeds, getAllOrders, makeOrder } from './actions';

type TOrdersState = {
  feeds: TOrder[];
  orders: TOrder[];
  currentOrder: TOrder;
  loading: boolean;
  loadingCurrentOrder: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feeds: [],
  orders: [],
  currentOrder: {
    _id: '',
    status: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 0,
    ingredients: []
  },
  loading: false,
  loadingCurrentOrder: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: {
      reducer: (state, action: PayloadAction<TOrder>) => {
        state.feeds.push(action.payload);
        state.currentOrder = { ...action.payload };
        state.orders?.push(action.payload);
      },
      prepare: (orderData: Omit<TOrder, '_id'>) => {
        const _id: string = nanoid();
        return { payload: { ...orderData, _id } };
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = {
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 0,
        ingredients: []
      };
    }
  },
  selectors: {
    getFeedsAll: (state) => state.feeds,
    getLastOrderNumber: (state) =>
      state.feeds.length > 0 ? state.feeds[state.feeds.length - 1].number : 0,
    getCurrentOrder: (state) => state.currentOrder,
    getOrdersAll: (state) => state.orders,
    getCurrentOrderLoading: (state) => state.loadingCurrentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllFeeds.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          console.log('Orders in reducer:', action.payload);
          state.loading = false;
          state.feeds = action.payload;
        }
      )
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(makeOrder.pending, (state) => {
        state.loadingCurrentOrder = true;
        state.error = null;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.loadingCurrentOrder = false;
        state.error = action.error.message || 'error';
        console.log(state.error);
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.loadingCurrentOrder = false;

        const newOrder: TOrder = {
          _id: action.payload.order._id || '',
          number: action.payload.order.number,
          status: action.payload.order.status || 'pending',
          name: action.payload.name,
          createdAt: action.payload.order.createdAt || new Date().toString(),
          updatedAt: action.payload.order.updatedAt || new Date().toString(),
          ingredients: action.payload.order.ingredients || []
        };
        state.currentOrder = newOrder;
        state.feeds.push(newOrder);
        state.orders.push(newOrder);
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export default ordersSlice.reducer;
export const {
  getFeedsAll,
  getLastOrderNumber,
  getCurrentOrder,
  getOrdersAll,
  getCurrentOrderLoading
} = ordersSlice.selectors;
export const { createOrder, clearCurrentOrder } = ordersSlice.actions;
