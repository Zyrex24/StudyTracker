import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulated API call
const loginAPI = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }
  
  // Simulate successful login
  return {
    id: Date.now(),
    email: credentials.email,
    name: credentials.name || 'User',
    preferences: {}
  };
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, updateProfile } = authSlice.actions;
export const selectAuth = state => state.auth;
export default authSlice.reducer;
