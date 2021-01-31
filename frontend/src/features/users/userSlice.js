import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { reviewResetted } from '../restaurant/reviewSlice';
import { restaurantResetted } from '../restaurants/restaurantSlice';
import { _deleteUser, _editUser, _getUsers } from './Api';

export const initialStateUsers = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async data => {
  const response = await _getUsers(data);
  return response;
});

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (data, { dispatch }) => {
    const response = await _deleteUser(data);
    dispatch(restaurantResetted());
    dispatch(reviewResetted());
    return response;
  }
);

export const editUser = createAsyncThunk('users/editUser', async data => {
  const response = await _editUser(data);
  return response;
});

export const userSlice = createSlice({
  name: 'counter',
  initialState: initialStateUsers,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched posts to the array
      state.users = action.payload;
    },
    [fetchUsers.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [deleteUser.fulfilled]: (state, action) => {
      let currentUser = state.users.filter(user => user._id !== action.payload);
      state.users = currentUser;
    },
    [editUser.fulfilled]: (state, action) => {},
  },
});

export const { increment, decrement, incrementByAmount } = userSlice.actions;

export const selectAllUsers = state => state.users.users;

export default userSlice.reducer;
