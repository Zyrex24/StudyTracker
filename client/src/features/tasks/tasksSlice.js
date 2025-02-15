import { createSlice } from '@reduxjs/toolkit';
import { incrementTasksCompleted, decrementTasksCompleted } from '../stats/statsSlice';

const initialState = {
  tasks: []
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    }
  }
});

// Thunk to handle task completion with stats update
export const toggleTaskWithStats = (taskId) => (dispatch, getState) => {
  const task = getState().tasks.tasks.find(t => t.id === taskId);
  if (task) {
    const wasCompleted = task.completed;
    dispatch(toggleTask(taskId));
    // Update stats based on the previous state
    if (!wasCompleted) {
      dispatch(incrementTasksCompleted());
    } else {
      dispatch(decrementTasksCompleted());
    }
  }
};

export const { addTask, toggleTask } = tasksSlice.actions;
export const selectTasks = state => state.tasks.tasks;
export default tasksSlice.reducer;
