// src/components/StudentPage.js
import React, { useState } from "react";

const StudentPage = ({ name }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user's message to chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response
    const botResponse = getBotResponse(input);
    setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);

    // Clear input field
    setInput("");
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    // Simple responses for demonstration
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
      <h1>Welcome, {name} (Student)</h1>
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
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
    fontFamily: "Arial, sans-serif",
  },
  chatBox: {
    width: "80%",
    maxHeight: "400px",
    margin: "20px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflowY: "scroll",
    backgroundColor: "#f9f9f9",
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
    justifyContent: "center",
    marginTop: "10px",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    marginLeft: "10px",
    borderRadius: "5px",
    backgroundColor: "#4285f4",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default StudentPage;

