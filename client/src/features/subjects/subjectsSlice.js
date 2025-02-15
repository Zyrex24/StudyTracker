import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjects: []
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject: (state, action) => {
      state.subjects.push(action.payload);
    },
    updateProgress: (state, action) => {
      const { id, progress } = action.payload;
      const subject = state.subjects.find(s => s.id === id);
      if (subject) {
        subject.progress = progress;
      }
    },
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(s => s.id !== action.payload);
    }
  }
});

export const { addSubject, updateProgress, removeSubject } = subjectsSlice.actions;
export const selectSubjects = state => state.subjects.subjects;
export default subjectsSlice.reducer;
