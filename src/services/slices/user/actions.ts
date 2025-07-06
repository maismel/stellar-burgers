import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWithRefresh,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData,
  getUserApi
} from '@api';
import { getCookie, setCookie } from '../../../utils/cookie';
import { TUser } from '@utils-types';

export const registerUser = createAsyncThunk<{ user: TUser }, TRegisterData>(
  'user/registerUser',
  async (userData) => {
    const response = await registerUserApi(userData);
    return response;
  }
);

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('user/loginUser', async ({ email, password }) => {
  const data = await loginUserApi({ email, password });
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
});

async function fetchUser(): Promise<{ user: TUser }> {
  const dataUser = await fetchWithRefresh('auth/user', {
    headers: {
      authorization: `Bearer ${getCookie('accessToken')}`
    }
  });
  return dataUser as { user: TUser };
}

export const checkUserAuth = createAsyncThunk('user/checkUser', async () => {
  const { user } = await fetchUser();
  return user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  logoutApi;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const getUserFromServer = createAsyncThunk(
  'user/getFromServer',
  async () => {
    const res = await getUserApi();
    return res.user;
  }
);
