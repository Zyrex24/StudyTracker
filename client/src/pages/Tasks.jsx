import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addTask, toggleTaskWithStats, selectTasks } from '../features/tasks/tasksSlice';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TaskInput = styled.input`
  padding: 0.75rem;
  margin-right: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
`;

const TaskButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
  }
`;

const TaskCheckbox = styled.input`
  margin-right: 1rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TaskText = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  opacity: ${props => props.$completed ? 0.7 : 1};
`;

export default function Tasks() {
  const [newTask, setNewTask] = useState('');
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask({
        id: Date.now(),
        text: newTask,
        completed: false
      }));
      setNewTask('');
    }
  };

  const handleToggleTask = (taskId) => {
    dispatch(toggleTaskWithStats(taskId));
  };

  return (
    <PageContainer>
      <h1>Task Management</h1>
      <form onSubmit={handleAddTask}>
        <TaskInput
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <TaskButton type="submit">Add Task</TaskButton>
      </form>
      <TaskList>
        {tasks.map(task => (
          <TaskItem key={task.id}>
            <TaskCheckbox
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
            />
            <TaskText $completed={task.completed}>
              {task.text}
            </TaskText>
          </TaskItem>
        ))}
      </TaskList>
    </PageContainer>
  );
}