import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './actions';

export type TUserState = {
  isAuthChecked: boolean;
  user: null | TUser;
  loginUserError: null | string;
  loginUserRequest: boolean;
  registerUserError: undefined | string;
  registerUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: '',
  registerUserRequest: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload as string;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.registerUserRequest = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { authChecked } = userSlice.actions;

export const { getUser, getIsAuthChecked } = userSlice.selectors;

export default userSlice.reducer;
