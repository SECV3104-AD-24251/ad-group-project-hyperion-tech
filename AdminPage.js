
/* import React, { useState } from "react";
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

export default AdminPage; */
/*
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
          <button
            className="faq-button"
            onClick={() => window.open('http://localhost:5173', '_blank')}
          >
            Chat History
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
*/
// AdminPage.js
// AdminPage.js
/*
import React, { useState, useEffect } from "react";
import { ref, set, onValue, off, push } from "firebase/database";
import { database } from "./firebaseConfig";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import FaqEditorPage from "./FaqEditorPage";
import CateEditor from "./CateEditor";
import "./styles/Chat.css";

const AdminPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null); // null, 'faq', or 'category'
  const adminId = "admin123"; // Example admin ID
  const chatId = "123_admin123"; // Shared chat ID between student and admin

  // Load messages from Firebase
  useEffect(() => {
    const messageRef = ref(database, `chats/${chatId}`);
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    };

    onValue(messageRef, handleValueChange);
    return () => off(messageRef);
  }, [chatId]);

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
    saveMessage(`chats/${chatId}`, {
      sender: "admin",
      text: message,
      timestamp: Date.now(),
    });
  };

  const handleNewChat = async () => {
    try {
      await set(ref(database, `chats/${chatId}`), null);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const openFaqEditor = () => setActiveEditor("faq");
  const openCategoryEditor = () => setActiveEditor("category");
  const closeEditor = () => setActiveEditor(null);

  if (activeEditor === "faq") {
    return <FaqEditorPage onBack={closeEditor} />;
  }
  if (activeEditor === "category") {
    return <CateEditor onBack={closeEditor} />;
  }

  return (
    <div className="chat-container">
      <div className="top-bar">
        <button className="hamburger-button" onClick={toggleSidebar}>
          { <svg
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
            </svg>}
        </button>
        <div className="editor-buttons">
          <button className="faq-button" onClick={openFaqEditor}>
            Manage FAQs
          </button>
          <button className="faq-button" onClick={openCategoryEditor}>
            Manage Categories
          </button>
          <button
            className="faq-button"
            onClick={() => window.open("http://localhost:5173", "_blank")}
          >
            Chat History
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
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text}
              type={msg.sender === "student" ? "user" : "assistant"}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default AdminPage;*/
import React, { useState, useEffect } from "react";
import { ref, set, onValue, off, push } from "firebase/database";
import { database } from "./firebaseConfig";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import FaqEditorPage from "./FaqEditorPage";
import CateEditor from "./CateEditor";
import NotificationsCustomizationPage from "./NotificationsCustomizationPage"; // Import Notifications Page
import "./styles/Chat.css";

const AdminPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null); // null, 'faq', or 'category'
  const [showNotifications, setShowNotifications] = useState(false); // New state to manage notification page visibility
  const adminId = "admin123"; // Example admin ID
  const chatId = "123_admin123"; // Shared chat ID between student and admin

  // Load messages from Firebase
  useEffect(() => {
    const messageRef = ref(database, `chats/${chatId}`);
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    };

    onValue(messageRef, handleValueChange);
    return () => off(messageRef);
  }, [chatId]);

  // Save message to Firebase with student info
  const saveMessage = async (path, messageObj, studentId, studentName) => {
    try {
      const newMessageRef = push(ref(database, path));
      await set(newMessageRef, {
        ...messageObj,
        studentId,  // Store the student's user ID
        studentName, // Store the student's name
      });
    } catch (error) {
      console.error(`Error saving message to ${path}:`, error);
    }
  };

  const handleSendMessage = (message, studentId, studentName) => {
    if (!message) return;
    saveMessage(`chats/${chatId}`, {
      sender: "admin",
      text: message,
      timestamp: Date.now(),
    }, studentId, studentName); // Pass student ID and name
  };

  const handleNewChat = async () => {
    try {
      await set(ref(database, `chats/${chatId}`), null);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const openFaqEditor = () => setActiveEditor("faq");
  const openCategoryEditor = () => setActiveEditor("category");
  const closeEditor = () => setActiveEditor(null);

  // Handle navigating to the notification page
  const openNotificationsPage = () => setShowNotifications(true);
  const closeNotificationsPage = () => setShowNotifications(false);

  if (showNotifications) {
    return <NotificationsCustomizationPage onBack={closeNotificationsPage} />;
  }

  if (activeEditor === "faq") {
    return <FaqEditorPage onBack={closeEditor} />;
  }
  if (activeEditor === "category") {
    return <CateEditor onBack={closeEditor} />;
  }

  return (
    <div className="chat-container">
      <div className="top-bar">
        <button className="hamburger-button" onClick={toggleSidebar}>
          {<svg
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
            </svg>}
        </button>
        <div className="editor-buttons">
          <button className="faq-button" onClick={openFaqEditor}>
            Manage FAQs
          </button>
          <button className="faq-button" onClick={openCategoryEditor}>
            Manage Categories
          </button>
          <button
            className="faq-button"
            onClick={() => window.open("http://localhost:5173", "_blank")}
          >
            Chat History
          </button>
          <button
            className="faq-button"
            onClick={openNotificationsPage} // Button to open notifications page
          >
            Manage Notifications
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
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.studentName ? msg.studentName : 'Unknown User'}</strong> {/* Display student’s name */}
              <ChatMessage
                message={msg.text}
                type={msg.sender === "student" ? "user" : "assistant"}
              />
            </div>
          ))}
        </div>
        <ChatInput onSendMessage={(message) => handleSendMessage(message, "student123", "Admin")} /> {/* Example for student */}
      </div>
    </div>
  );
};

export default AdminPage;


