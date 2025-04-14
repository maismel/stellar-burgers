import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWithRefresh,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData
} from '@api';
import { getCookie, setCookie } from '../../../utils/cookie';
import { TUser } from '@utils-types';
import { authChecked } from './userSlice';

export const registerUser = createAsyncThunk<
  { user: TUser },
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(userData);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Ошибка регистрации';
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
  }
});

async function fetchUser(): Promise<{ user: TUser }> {
  const dataUser = await fetchWithRefresh('auth/user', {
    headers: {
      authorization: `Bearer ${getCookie('accessToken')}`
    }
  });
  return dataUser as { user: TUser };
}

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkUser', async (_, { dispatch, rejectWithValue }) => {
  try {
    if (getCookie('accessToken')) {
      const { user } = await fetchUser();
      return user;
    }
    return null;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Ошибка проверки пользователя'
    );
  } finally {
    dispatch(authChecked());
  }
});

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
