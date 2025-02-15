import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  streak: 0,
  todayStudyTime: 0,
  tasksCompleted: 0,
  lastStudyDate: null
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStudyTime: (state, action) => {
      state.todayStudyTime += action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      if (state.lastStudyDate === today) {
        // Already studied today, just update time
        state.todayStudyTime += action.payload;
      } else if (state.lastStudyDate === getPreviousDay(today)) {
        // Studied yesterday, increment streak
        state.streak += 1;
        state.todayStudyTime = action.payload;
        state.lastStudyDate = today;
      } else {
        // Break in streak
        state.streak = 1;
        state.todayStudyTime = action.payload;
        state.lastStudyDate = today;
      }
    },
    incrementTasksCompleted: (state) => {
      state.tasksCompleted += 1;
    },
    decrementTasksCompleted: (state) => {
      state.tasksCompleted = Math.max(0, state.tasksCompleted - 1);
    }
  }
});

// Helper function to get previous day
const getPreviousDay = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

export const { updateStudyTime, incrementTasksCompleted, decrementTasksCompleted } = statsSlice.actions;
export const selectStats = state => state.stats;
export default statsSlice.reducer;
