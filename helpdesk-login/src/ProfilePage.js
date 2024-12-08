// ProfilePage.js
// ProfilePage.js
import React from "react";

const ProfilePage = ({ name, role, onLogout, goBack }) => {
  return (
    <div style={styles.container}>
      <div style={styles.profilePage}>
        <h2>Profile Page</h2>
        <p>Welcome, {name}!</p>
        <button onClick={onLogout} style={styles.button}>
          Logout
        </button>
        <button onClick={goBack} style={styles.button}>
          Back to {role === "student" ? "Student Chat" : "Admin Dashboard"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
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
};

export default ProfilePage;
