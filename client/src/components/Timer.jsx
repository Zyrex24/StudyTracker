import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { startTimer, stopTimer, resetTimer, tickTimer, selectTimer } from '../features/timer/timerSlice';
import { updateStudyTime } from '../features/stats/statsSlice';

const TimerContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  margin: 2rem 0;
`;

const TimeDisplay = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
  font-family: monospace;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    opacity: 0.9;
  }

  background: ${props => {
    if (props.$variant === 'start') return '#2ecc71';
    if (props.$variant === 'stop') return '#e74c3c';
    return '#3498db';
  }};
  color: white;
`;

export default function Timer() {
  const dispatch = useDispatch();
  const { isRunning, seconds } = useSelector(selectTimer);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  const handleStart = () => {
    dispatch(startTimer());
  };

  const handleStop = () => {
    dispatch(stopTimer());
    // Convert seconds to minutes before updating study time
    dispatch(updateStudyTime(Math.floor(seconds / 60)));
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <h2>Study Timer</h2>
      <TimeDisplay>{formatTime(seconds)}</TimeDisplay>
      <ButtonGroup>
        {!isRunning ? (
          <Button $variant="start" onClick={handleStart}>
            Start
          </Button>
        ) : (
          <Button $variant="stop" onClick={handleStop}>
            Stop
          </Button>
        )}
        <Button onClick={handleReset}>Reset</Button>
      </ButtonGroup>
    </TimerContainer>
  );
}
