import React, { useState, useEffect } from "react";
import { ref, set, onValue, off, push } from "firebase/database";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database, db } from "./firebaseConfig";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import FAQPage from "./FAQPage";
import ContactPage from './ContactPage';
import "./styles/Chat.css";
import BookmarkedChats from "./components/BookmarkedChats";

const StudentPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showBookmarkedChats, setShowBookmarkedChats] = useState(false);
  const [bookmarkedChats, setBookmarkedChats] = useState([]);
  const [bookmarkMessage, setBookmarkMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const userId = "123"; // Example student ID
  const chatId = `${userId}_admin123`; // Shared chat ID between student and admin

  useEffect(() => {
    if (showBookmarkedChats) {
      const fetchBookmarkedChats = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "bookmarkedChats"));
          const chats = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookmarkedChats(chats);
        } catch (error) {
          console.error("Error fetching bookmarked chats:", error);
        }
      };
      fetchBookmarkedChats();
    }
  }, [showBookmarkedChats]);

  // Fetch notifications from Firebase
  useEffect(() => {
    const notificationRef = ref(database, "notifications");
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsArray = Object.values(data);
        setNotifications(notificationsArray);
        // Count unread notifications
        const unread = notificationsArray.filter((notif) => !notif.readStatus).length;
        setUnreadCount(unread);
      }
    };

    onValue(notificationRef, handleValueChange);
    return () => off(notificationRef); // Cleanup
  }, []);

  // Mark notifications as read when clicked
  const handleNotificationClick = () => {
    // Mark all unread notifications as read
    notifications.forEach((notif) => {
      if (!notif.readStatus) {
        const notificationRef = ref(database, `notifications/${notif.id}`);
        set(notificationRef, { ...notif, readStatus: true });
      }
    });
    setShowNotifications(false); // Close the modal after viewing
  };

  // Modal toggle for notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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

  // Load messages from Firebase
  useEffect(() => {
    if (!showBookmarkedChats) {
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
    }
  }, [chatId, showBookmarkedChats]);

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

  const handleSendMessage = (message) => {
    if (!message) return;
    saveMessage(`chats/${chatId}`, {
      sender: "student",
      text: message,
      timestamp: Date.now(),
    }, userId, name); // Pass student ID and name
  };

  const handleNewChat = async () => {
    try {
      await set(ref(database, `chats/${chatId}`), null);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleFAQ = () => setShowFAQ((prev) => !prev);
  const toggleContact = () => setShowContact((prev) => !prev);
  const toggleBookmarkedChats = () => setShowBookmarkedChats((prev) => !prev);

  const handleBookmarkConversation = async () => {
    if (messages.length === 0) {
      setBookmarkMessage("No conversation to bookmark.");
      setTimeout(() => setBookmarkMessage(null), 3000); // Clear the message after 3 seconds
      return; // Exit the function
    }

    try {
      const chatContent = messages.map((msg) => ({
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp,
      }));
      const bookmarkData = {
        chatId,
        userId,
        userName: name,
        messages: chatContent,
        bookmarkedAt: new Date().toISOString(),
      };

      console.log("Attempting to save bookmark:", bookmarkData); // Debug log

      await addDoc(collection(db, "bookmarkedChats"), bookmarkData);
      setBookmarkMessage("Conversation bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking conversation:", error); // Capture error
      setBookmarkMessage("Failed to bookmark conversation. Try again.");
    } finally {
      setTimeout(() => setBookmarkMessage(null), 3000); // Clear message
    }
  };

  if (showFAQ) {
    return <FAQPage onBack={toggleFAQ} />;
  }

  if (showContact) {
    return <ContactPage onBack={toggleContact} />;
  }

  if (showBookmarkedChats) {
    return (
      <BookmarkedChats 
        bookmarkedChats={bookmarkedChats}
        toggleBookmarkedChats={toggleBookmarkedChats}
      />
    );
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
            </svg>
            }
        </button>
        <button className="faq-button" onClick={toggleFAQ}>FAQ</button>
        <button className="contact-button" onClick={toggleContact}>Contact</button>
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        
        <div className="notification-icon" onClick={toggleNotifications}>
          <i className="fa fa-bell"></i>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
      </div>

      <Sidebar
        onNewChat={handleNewChat}
        onBookmarkedChats={toggleBookmarkedChats}
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
              type={msg.sender === "admin" ? "assistant" : "user"}
            />
          ))}
        </div>
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onBookmark={handleBookmarkConversation} 
          bookmarkMessage={bookmarkMessage}
        />
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Notifications</h3>
            <ul>
              {notifications.map((notif, index) => (
                <li key={index}>
                  {notif.text}
                  {notif.readStatus ? " (Read)" : " (Unread)"}
                </li>
              ))}
            </ul>
            <button className="modal-button" onClick={handleNotificationClick}>Mark All as Read</button>
            <button className="modal-button" onClick={toggleNotifications}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
