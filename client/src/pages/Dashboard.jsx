import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectStats } from '../features/stats/statsSlice';
import Timer from '../components/Timer';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin: 0.5rem 0;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 1rem;
`;

export default function Dashboard() {
  const stats = useSelector(selectStats);

  return (
    <PageContainer>
      <h1>Dashboard</h1>
      <Timer />
      
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>days in a row!</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{Math.round(stats.todayStudyTime / 60)} hours</StatValue>
          <StatLabel>studied today</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.tasksCompleted}</StatValue>
          <StatLabel>tasks completed</StatLabel>
        </StatCard>
      </StatsGrid>
    </PageContainer>
  );
}
