import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Subjects from './pages/Subjects';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px; // Width of sidebar
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;