import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiCheckSquare, FiBook, FiBarChart2, FiMessageSquare, FiUser } from 'react-icons/fi';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background: white;
  position: fixed;
  left: 0;
  top: 0;
  padding: 2rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
`;

const Logo = styled.h1`
  color: #3498db;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background: #f8f9fa;
    transform: translateX(5px);
  }

  &.active {
    background: #3498db;
    color: white;
  }

  svg {
    font-size: 1.25rem;
  }
`;

export default function Sidebar() {
  return (
    <SidebarContainer>
      <Logo>Study Tracker</Logo>
      <NavList>
        <StyledNavLink to="/">
          <FiHome /> Dashboard
        </StyledNavLink>
        <StyledNavLink to="/tasks">
          <FiCheckSquare /> Tasks
        </StyledNavLink>
        <StyledNavLink to="/subjects">
          <FiBook /> Subjects
        </StyledNavLink>
        <StyledNavLink to="/analytics">
          <FiBarChart2 /> Analytics
        </StyledNavLink>
        <StyledNavLink to="/ai-assistant">
          <FiMessageSquare /> AI Assistant
        </StyledNavLink>
        <StyledNavLink to="/profile">
          <FiUser /> Profile
        </StyledNavLink>
      </NavList>
    </SidebarContainer>
  );
}
