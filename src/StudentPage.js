import React, { useState, useEffect } from "react";
import { ref, set, onValue, off, push } from "firebase/database";
import { database } from "./firebaseConfig";
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import FAQPage from './FAQPage';
import './styles/Chat.css';

const StudentPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const userId = "123"; 
  // Load messages from Firebase
  useEffect(() => {
    const messageRef = ref(database, `messages/${userId}`);
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    };

    onValue(messageRef, handleValueChange);
    return () => off(messageRef);
  }, [userId]);

  // Botpress Webchat Integration
  useEffect(() => {
    const script1 = document.createElement("script");
    const script2 = document.createElement("script");

    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    script2.src = "https://files.bpcontent.cloud/2024/12/14/15/20241214151245-VNETT1ET.js";
    script2.async = true;
    document.body.appendChild(script2);

    script2.onload = () => {
      console.log("Botpress Webchat script loaded.");
      if (window.botpressWebChat) {
        console.log("Initializing Botpress Webchat...");
        window.botpressWebChat.init();

        // Add event listener for Botpress messages
        window.botpressWebChat.onEvent((event) => {
          console.log("Botpress Event Captured:", event);
          if (event.type === "message") {
            const { text, user, metadata } = event.payload;
            const sender = user === "bot" ? "assistant" : "user";
            const messageObj = {
              sender,
              text,
              timestamp: Date.now(),
              metadata,
            };

            console.log("Message to save:", messageObj);
            saveMessage(`botpressMessages/${userId}`, messageObj);
          }
        });
      } else {
        console.error("Botpress Webchat not loaded.");
      }
    };

    script1.onerror = script2.onerror = () => {
      console.error("Failed to load Botpress Webchat scripts.");
    };

    // Cleanup scripts
    return () => {
      if (document.body.contains(script1)) document.body.removeChild(script1);
      if (document.body.contains(script2)) document.body.removeChild(script2);
    };
  }, [userId]);

  // Save message to Firebase
  const saveMessage = async (path, messageObj) => {
    try {
      console.log(`Saving message to ${path}:`, messageObj);
      const newMessageRef = push(ref(database, path));
      await set(newMessageRef, messageObj);
      console.log("Message saved successfully!");
    } catch (error) {
      console.error(`Error saving message to ${path}:`, error);
    }
  };

  const handleSendMessage = (message) => {
    if (!message) return;
    saveMessage(`messages/${userId}`, {
      sender: "user",
      text: message,
      timestamp: Date.now(),
    });

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      saveMessage(`messages/${userId}`, {
        sender: "assistant",
        text: botResponse,
        timestamp: Date.now(),
      });
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message?.toLowerCase();
    if (lowerCaseMessage.includes("amendment")) {
      return "For questions regarding amendments, please visit: https://my.utm.my/";
    } else if (lowerCaseMessage.includes("help")) {
      return "How can I assist you with Faculty of Computing matters?";
    } else if (lowerCaseMessage.includes("schedule")) {
      return "You can check your class schedule in the UTM portal: https://my.utm.my/";
    } else {
      return "I'm here to help with Faculty of Computing related questions. Could you please be more specific?";
    }
  };

  const handleNewChat = async () => {
    try {
      await set(ref(database, `messages/${userId}`), null);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleFAQ = () => setShowFAQ((prev) => !prev);

  return showFAQ ? (
    <FAQPage onBack={toggleFAQ} />
  ) : (
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
        <button className="faq-button" onClick={toggleFAQ}>FAQ</button>
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

export default StudentPage;
