import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { database } from './firebaseConfig';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import './styles/Chat.css';

const StudentPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userId = "123"; // In production, this should be the actual user ID

  useEffect(() => {
    const messageRef = ref(database, `messages/${userId}`);
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, [userId]);

  const saveMessage = (message, sender) => {
    const newMessageRef = push(ref(database, `messages/${userId}`));
    set(newMessageRef, {
      sender,
      text: message,
      timestamp: Date.now(),
    });
  };

  const handleSendMessage = (message) => {
    saveMessage(message, 'user');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      saveMessage(botResponse, 'assistant');
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('amendment')) {
      return "For questions regarding amendments, please visit: https://my.utm.my/";
    } else if (lowerCaseMessage.includes('help')) {
      return "How can I assist you with Faculty of Computing matters?";
    } else if (lowerCaseMessage.includes('schedule')) {
      return "You can check your class schedule in the UTM portal: https://my.utm.my/";
    } else {
      return "I'm here to help with Faculty of Computing related questions. Could you please be more specific?";
    }
  };

  const handleNewChat = () => {
    // Clear current chat messages
    set(ref(database, `messages/${userId}`), null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="chat-container">
      <div className="top-bar">
        <button className="hamburger-button" onClick={toggleSidebar}>
          <svg 
            stroke="currentColor" 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            height="1.5em" 
            width="1.5em" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      <Sidebar
        onNewChat={handleNewChat}
        onProfileClick={goToProfile}
        userName={name}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text}
              type={msg.sender === 'assistant' ? 'assistant' : 'user'}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default StudentPage;