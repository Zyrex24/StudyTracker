import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loading: false,
  error: null
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    sendMessageStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);
    },
    sendMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    }
  }
});

// Simulated AI response function
const getAIResponse = async (message) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple response logic
  const responses = {
    study: [
      "Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
      "Find a quiet study space and eliminate distractions.",
      "Take regular breaks to maintain focus and productivity.",
      "Review your notes regularly and create summary sheets.",
    ],
    motivation: [
      "Set specific, achievable goals for each study session.",
      "Reward yourself after completing study goals.",
      "Visualize your success and keep your end goal in mind.",
      "Track your progress to stay motivated.",
    ],
    time: [
      "Create a study schedule and stick to it.",
      "Use our timer feature to track your study sessions.",
      "Break large tasks into smaller, manageable chunks.",
      "Prioritize your tasks based on importance and deadlines.",
    ]
  };

  const lowercaseMessage = message.toLowerCase();
  let response = "I'm here to help you study more effectively. Try asking about study techniques, motivation, or time management!";
  
  Object.entries(responses).forEach(([key, answers]) => {
    if (lowercaseMessage.includes(key)) {
      response = answers[Math.floor(Math.random() * answers.length)];
    }
  });

  return response;
};

// Thunk for handling AI messages
export const sendMessage = (message) => async (dispatch) => {
  try {
    dispatch(sendMessageStart());
    
    // Add user message
    dispatch(sendMessageSuccess({
      id: Date.now(),
      text: message,
      sender: 'user'
    }));

    // Get AI response
    const response = await getAIResponse(message);
    
    // Add AI response
    dispatch(sendMessageSuccess({
      id: Date.now() + 1,
      text: response,
      sender: 'ai'
    }));
  } catch (error) {
    dispatch(sendMessageFailure(error.message));
  }
};

export const { sendMessageStart, sendMessageSuccess, sendMessageFailure, clearMessages } = aiSlice.actions;
export const selectAI = state => state.ai;
export default aiSlice.reducer;
