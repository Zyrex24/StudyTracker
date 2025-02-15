import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.875rem;
`;

export default function Analytics() {
  const sessions = useSelector(state => state.timer?.sessions || []);

  // Memoize selectors
  const totalHours = useMemo(() => sessions.reduce((acc, session) => acc + session.duration / 3600, 0), [sessions]);
  const averageSessionLength = useMemo(() => sessions.length > 0 ? totalHours / sessions.length : 0, [sessions, totalHours]);
  const totalSessions = useMemo(() => sessions.length, [sessions]);

  // Prepare chart data
  const data = useMemo(() => ({
    labels: sessions.map(s => new Date(s.startTime).toLocaleDateString()),
    datasets: [{
      label: 'Study Hours',
      data: sessions.map(s => s.duration / 3600),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      tension: 0.4
    }]
  }), [sessions]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Study Session History'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };

  return (
    <PageContainer>
      <h1>Analytics</h1>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{totalHours.toFixed(1)}</StatValue>
          <StatLabel>Total Study Hours</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalSessions}</StatValue>
          <StatLabel>Total Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{averageSessionLength.toFixed(1)}</StatValue>
          <StatLabel>Avg. Session Length (hours)</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartCard>
        <Line data={data} options={options} />
      </ChartCard>
    </PageContainer>
  );
}