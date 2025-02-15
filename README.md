# Study Tracker - Modern Study Management Application

## Overview
Study Tracker is a comprehensive MERN (MongoDB, Express, React, Node.js) stack application designed to help users optimize their study sessions with advanced features and real-time analytics.

## Features
- **Study Timer**: Track study sessions with a Pomodoro-style timer
- **Task Management**: Create, track, and complete study tasks
- **Subject Management**: Organize study materials by subject with progress tracking
- **Analytics Dashboard**: Visualize study patterns and progress
- **AI Study Assistant**: Get personalized study tips and advice
- **User Profiles**: Manage personal settings and preferences

## Tech Stack
### Frontend
- React 18
- Redux Toolkit (State Management)
- React Router DOM (Navigation)
- Styled Components (Styling)
- Chart.js (Data Visualization)
- React Icons

### Backend
- Express
- MongoDB with Mongoose
- JWT Authentication
- CORS
- Dotenv

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/study-tracker.git
cd study-tracker
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm run dev
```

## Project Structure
```
study-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── features/      # Redux slices and logic
│   │   ├── pages/         # Page components
│   │   └── app/           # Redux store and app configuration
│   └── public/            # Static assets
└── server/                # Backend Express application
    ├── controllers/       # Route controllers
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## Features in Detail

### Study Timer
- Pomodoro-style timer with customizable duration
- Session tracking and statistics
- Break reminders

### Task Management
- Create, edit, and delete tasks
- Mark tasks as complete
- Task categorization
- Progress tracking

### Subject Management
- Create and manage study subjects
- Track progress for each subject
- Set study goals
- Visual progress indicators

### Analytics Dashboard
- Study time visualization
- Task completion rates
- Subject progress charts
- Streak tracking

### AI Study Assistant
- Study technique suggestions
- Time management advice
- Motivation tips
- Personalized recommendations

### User Profiles
- Personal information management
- Study preferences
- Progress history
- Authentication system

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- React Icons for the icon set
- Chart.js for data visualization
- Styled Components for the styling system
