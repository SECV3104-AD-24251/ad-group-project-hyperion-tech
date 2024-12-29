import React from 'react';
import '../styles/Chat.css';

const ChatMessage = ({ message, type }) => {
  return (
    <div className={`message ${type}`}>
      <div className="message-avatar">
        {type === 'assistant' ? '🤖' : '👤'}
      </div>
      <div className="message-content">
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;