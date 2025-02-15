import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  seconds: 0
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    stopTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.seconds = 0;
      state.isRunning = false;
    },
    tickTimer: (state) => {
      state.seconds += 1;
    }
  }
});

export const { startTimer, stopTimer, resetTimer, tickTimer } = timerSlice.actions;
export const selectTimer = state => state.timer;
export default timerSlice.reducer;
