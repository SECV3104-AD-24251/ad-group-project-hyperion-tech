import React, { useState } from "react";
import { ref, set, push } from "firebase/database";
import { database } from "./firebaseConfig";
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import FaqEditorPage from './FaqEditorPage';
import CateEditor from './CateEditor';
import './styles/Chat.css';

const AdminPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null); // null, 'faq', or 'category'
  const adminId = "admin123"; // Replace with actual admin ID logic in production

  // Save message to Firebase
  const saveMessage = async (path, messageObj) => {
    try {
      const newMessageRef = push(ref(database, path));
      await set(newMessageRef, messageObj);
    } catch (error) {
      console.error(`Error saving message to ${path}:`, error);
    }
  };

  const handleSendMessage = (message) => {
    if (!message) return;

    // Save user message to Firebase
    saveMessage(`adminMessages/${adminId}`, {
      sender: "user",
      text: message,
      timestamp: Date.now(),
    });

    // Simulate bot response
    setTimeout(() => {
      saveMessage(`adminMessages/${adminId}`, {
        sender: "assistant",
        text: "This is an automated response for admin queries.",
        timestamp: Date.now(),
      });
    }, 1000);
  };

  const handleNewChat = async () => {
    try {
      await set(ref(database, `adminMessages/${adminId}`), null);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Editor navigation handlers
  const openFaqEditor = () => setActiveEditor('faq');
  const openCategoryEditor = () => setActiveEditor('category');
  const closeEditor = () => setActiveEditor(null);

  // Render the active editor if any
  if (activeEditor === 'faq') {
    return <FaqEditorPage onBack={closeEditor} />;
  }
  if (activeEditor === 'category') {
    return <CateEditor onBack={closeEditor} />;
  }

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
        <div className="editor-buttons">
          <button className="faq-button" onClick={openFaqEditor}>
            Manage FAQs
          </button>
          <button className="faq-button" onClick={openCategoryEditor}>
            Manage Categories
          </button>
        </div>
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
              type={msg.sender === "assistant" ? "assistant" : "user"}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default AdminPage;
