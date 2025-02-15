import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { sendMessage, selectAI } from '../features/ai/aiSlice';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  overflow-y: auto;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  max-width: 80%;
  ${props => props.$sender === 'user' ? `
    align-self: flex-end;
    background: #3498db;
    color: white;
  ` : `
    align-self: flex-start;
    background: #f8f9fa;
    color: #2c3e50;
  `}
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  flex-grow: 1;
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

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(selectAI);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      dispatch(sendMessage(input.trim()));
      setInput('');
    }
  };

  return (
    <PageContainer>
      <h1>AI Study Assistant</h1>
      <ChatContainer ref={chatContainerRef}>
        <MessageList>
          {messages.length === 0 && (
            <Message $sender="ai">
              Hello! I'm your AI study assistant. How can I help you today?
              Try asking about:
              • Study techniques
              • Time management
              • Staying motivated
            </Message>
          )}
          {messages.map(message => (
            <Message key={message.id} $sender={message.sender}>
              {message.text}
            </Message>
          ))}
        </MessageList>
      </ChatContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about studying..."
          disabled={loading}
        />
        <SendButton type="submit" disabled={loading || !input.trim()}>
          <FiSend />
          {loading ? 'Thinking...' : 'Send'}
        </SendButton>
      </InputContainer>
    </PageContainer>
  );
}
