import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

const studyTips = [
  {
    topic: 'time_management',
    responses: [
      "Based on your study patterns, I recommend using the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break. This can help maintain high concentration levels while preventing mental fatigue.",
      "Looking at your recent sessions, you might benefit from scheduling your most challenging subjects during your peak productivity hours. Your data shows you perform best in the morning.",
      "Consider implementing time-blocking: dedicate specific time slots to different subjects. This can help create a structured routine and reduce decision fatigue."
    ]
  },
  {
    topic: 'motivation',
    responses: [
      "I notice you've maintained a 5-day study streak! Remember, consistency is more important than perfection. Keep building on this momentum!",
      "Your analytics show significant progress in Mathematics. Use this success to motivate yourself in other subjects - you've proven you can master challenging topics.",
      "Try setting smaller, achievable goals for each study session. Your completion rate increases by 40% when you break down larger tasks into manageable chunks."
    ]
  },
  {
    topic: 'study_techniques',
    responses: [
      "Based on your learning patterns, you might benefit from the Feynman Technique: try explaining complex concepts in simple terms. This can help identify knowledge gaps and strengthen understanding.",
      "Your data shows improved retention when you use active recall. Consider creating flashcards or practice tests for key concepts.",
      "Looking at your subject progress, implementing mind mapping could help connect related concepts, especially in subjects where you're seeing patterns."
    ]
  },
  {
    topic: 'subject_specific',
    responses: [
      "I see you're spending more time on {{subject}}. For this subject, try using the SQ3R method: Survey, Question, Read, Recite, and Review. It's particularly effective for comprehensive understanding.",
      "Your progress in {{subject}} shows consistent improvement. To maintain this trajectory, consider creating summary notes after each study session.",
      "Based on your learning style and success patterns in {{subject}}, incorporating visual aids and diagrams might help solidify complex concepts."
    ]
  },
  {
    topic: 'productivity',
    responses: [
      "Your productivity score peaks when you study in 45-minute intervals. Consider adjusting your timer settings to match this optimal duration.",
      "I've noticed you complete more tasks when you start with a quick review of previous material. This warm-up period seems to enhance your focus.",
      "Based on your break patterns, short 5-minute breaks every 25 minutes help maintain your concentration levels throughout longer study sessions."
    ]
  },
  {
    topic: 'stress_management',
    responses: [
      "I notice increased task completion when you take regular breaks. Remember to maintain a balanced approach to studying - your data shows better results with consistent, moderate sessions rather than intense cramming.",
      "Consider incorporating brief mindfulness exercises between subjects. Your focus scores improve by 25% after short mental reset periods.",
      "Your performance data suggests that short walks during breaks enhance your subsequent study session effectiveness."
    ]
  }
];

const getContextualResponse = (topic, context = {}) => {
  const topicResponses = studyTips.find(t => t.topic === topic)?.responses || studyTips[0].responses;
  const response = topicResponses[Math.floor(Math.random() * topicResponses.length)];
  
  // Replace any placeholders with context values
  return Object.entries(context).reduce(
    (str, [key, value]) => str.replace(`{{${key}}}`, value),
    response
  );
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const userMessage = {
        id: Date.now(),
        text: action.payload,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      
      // Analyze message for topic
      const topics = {
        time: 'time_management',
        schedule: 'time_management',
        motivation: 'motivation',
        technique: 'study_techniques',
        subject: 'subject_specific',
        productive: 'productivity',
        stress: 'stress_management',
      };
      
      const topic = Object.entries(topics).find(
        ([key]) => action.payload.toLowerCase().includes(key)
      )?.[1] || 'motivation';

      const context = {
        subject: action.payload.match(/about (.+?)\b/)?.[1] || 'your current subject',
      };

      const aiResponse = {
        id: Date.now() + 1,
        text: getContextualResponse(topic, context),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      state.messages.push(userMessage, aiResponse);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { sendMessage, clearMessages } = aiSlice.actions;
export const selectAI = state => state.ai;
export default aiSlice.reducer;
