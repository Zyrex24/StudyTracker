import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../features/timer/timerSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import statsReducer from '../features/stats/statsSlice';
import authReducer from '../features/auth/authSlice';
import aiReducer from '../features/ai/aiSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    tasks: tasksReducer,
    subjects: subjectsReducer,
    stats: statsReducer,
    auth: authReducer,
    ai: aiReducer
  },
});
