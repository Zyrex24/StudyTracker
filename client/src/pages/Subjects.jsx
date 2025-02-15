import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiBook } from 'react-icons/fi';
import { addSubject, selectSubjects } from '../features/subjects/subjectsSlice';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SubjectCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SubjectIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const SubjectTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #3498db;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const AddSubjectButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

export default function Subjects() {
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ title: '', goal: '' });
  const dispatch = useDispatch();
  const subjects = useSelector(selectSubjects);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.title && newSubject.goal) {
      dispatch(addSubject({
        id: Date.now(),
        title: newSubject.title,
        goal: parseInt(newSubject.goal),
        progress: 0
      }));
      setNewSubject({ title: '', goal: '' });
      setShowModal(false);
    }
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Subjects</h1>
        <AddSubjectButton onClick={() => setShowModal(true)}>
          <FiPlus /> Add Subject
        </AddSubjectButton>
      </div>

      <SubjectsGrid>
        {subjects.map(subject => (
          <SubjectCard key={subject.id}>
            <SubjectIcon>
              <FiBook size={24} />
            </SubjectIcon>
            <SubjectTitle>{subject.title}</SubjectTitle>
            <div>Goal: {subject.goal} hours</div>
            <ProgressBar>
              <Progress value={(subject.progress / subject.goal) * 100} />
            </ProgressBar>
            <div>{Math.round((subject.progress / subject.goal) * 100)}% Complete</div>
          </SubjectCard>
        ))}
      </SubjectsGrid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Add New Subject</h2>
            <Form onSubmit={handleAddSubject}>
              <Input
                placeholder="Subject Title"
                value={newSubject.title}
                onChange={e => setNewSubject({...newSubject, title: e.target.value})}
                required
              />
              <Input
                type="number"
                placeholder="Study Goal (hours)"
                value={newSubject.goal}
                onChange={e => setNewSubject({...newSubject, goal: e.target.value})}
                min="1"
                required
              />
              <AddSubjectButton type="submit">
                Add Subject
              </AddSubjectButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
}