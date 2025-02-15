import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { loginUser, updateProfile, selectAuth } from '../features/auth/authSlice';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  margin-top: 1rem;
  text-align: center;
`;

export default function Profile() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(selectAuth);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        email: user.email || '',
        name: user.name || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setUpdateSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(loginUser(formData));
    } else {
      dispatch(updateProfile({
        name: formData.name,
        email: formData.email
      }));
      setUpdateSuccess(true);
    }
  };

  return (
    <PageContainer>
      <h1>{isAuthenticated ? 'Update Profile' : 'Login'}</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {!isAuthenticated && (
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isAuthenticated ? 'Update Profile' : 'Login'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {updateSuccess && <SuccessMessage>Profile updated successfully!</SuccessMessage>}
      </Form>
    </PageContainer>
  );
}
