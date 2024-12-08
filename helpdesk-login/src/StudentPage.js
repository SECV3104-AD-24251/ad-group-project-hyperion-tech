import React, { useState, useEffect } from "react";
import { ref, set, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";

const StudentPage = ({ name, goToProfile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const userId = "123"; // Example user ID, replace this with dynamic logic if needed.

  // Save a message to Firebase
  const saveMessage = (message, sender) => {
    const newMessageRef = push(ref(database, `messages/${userId}`));
    set(newMessageRef, {
      sender,
      text: message,
      timestamp: Date.now(),
    });
  };

  // Fetch messages from Firebase in real-time
  useEffect(() => {
    const messageRef = ref(database, `messages/${userId}`);
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle sending messages
  const handleSend = () => {
    if (!input.trim()) return;

    // Save user message
    saveMessage(input, "user");

    // Generate bot response
    const botResponse = getBotResponse(input);
    setTimeout(() => saveMessage(botResponse, "bot"), 1000); // Add a delay for realism

    setInput(""); // Clear input field
  };

  // Simulate bot responses
  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("help")) {
      return "Sure! What do you need help with?";
    } else if (lowerCaseMessage.includes("schedule")) {
      return "You can check your schedule in the university portal.";
    } else if (lowerCaseMessage.includes("contact")) {
      return "You can contact the admin office at admin@university.com.";
    } else {
      return "I'm sorry, I didn't understand that. Could you please rephrase?";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainPage}>
        <div style={styles.navbar}>
          <div style={styles.menuIcon}>&#9776;</div>
          <input type="text" placeholder="Search" style={styles.searchBar} />
          <div style={styles.profileIcon} onClick={goToProfile}>
            &#128100;
          </div>
        </div>

        <div style={styles.chatContainer}>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={
                  msg.sender === "bot" ? styles.botMessage : styles.userMessage
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
    padding: "10px 20px",
    height: "50px",
    borderBottom: "1px solid #ccc",
  },
  menuIcon: {
    fontSize: "20px",
    cursor: "pointer",
  },
  searchBar: {
    width: "60%",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  profileIcon: {
    fontSize: "20px",
    cursor: "pointer",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    marginBottom: "20px",
  },
  botMessage: {
    textAlign: "left",
    backgroundColor: "#e6f7ff",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px 0",
  },
  userMessage: {
    textAlign: "right",
    backgroundColor: "#dcf8c6",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px 0",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "30px",
    padding: "5px 10px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px",
    borderRadius: "30px",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
  profilePage: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  mainPage: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};

export default StudentPage;
