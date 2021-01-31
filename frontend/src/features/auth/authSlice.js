import { createSlice } from '@reduxjs/toolkit';
export const authSlice = createSlice({
  name: 'auth',
  initialState: [],
  reducers: {
    logOut: state => {},
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
