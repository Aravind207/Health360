import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
}

const token = localStorage.getItem('token');
const initialState: AuthState = {
  isLoggedIn: token !== null && token !== undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;