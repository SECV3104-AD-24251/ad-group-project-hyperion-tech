import React from 'react';
import '../styles/Chat.css';

const Sidebar = ({ onNewChat, onProfileClick, userName, isOpen, onToggle }) => {
  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-button" onClick={onToggle} aria-label="Toggle Sidebar">
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

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* New Chat Button */}
        <button className="new-chat-button" onClick={onNewChat}>
          <svg 
            stroke="currentColor" 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            height="1em" 
            width="1em" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New chat
        </button>

        {/* Profile Section */}
        <div className="profile-section">
          <button className="profile-button" onClick={onProfileClick}>
            <svg 
              stroke="currentColor" 
              fill="none" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              height="1em" 
              width="1em" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {userName}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
