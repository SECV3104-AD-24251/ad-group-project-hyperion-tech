// App.js
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";

import StudentPage from "./StudentPage";
import AdminPage from "./AdminPage";
import ProfilePage from "./ProfilePage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home"); // Manage navigation manually

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (email.endsWith("@graduate.utm.my")) {
        setUser({ role: "student", name: result.user.displayName });
        setCurrentPage("student");
      } else if (email.endsWith("@utm.my")) {
        setUser({ role: "admin", name: result.user.displayName });
        setCurrentPage("admin");
      } else {
        alert("Unauthorized email domain.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentPage("home"); // Redirect to the home page (login page)
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderPage = () => {
    if (!user) {
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Welcome to FC Helpdesk</h1>
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
      );
    }

    switch (currentPage) {
      case "student":
        return <StudentPage name={user.name} goToProfile={() => setCurrentPage("profile")} />;
      case "admin":
        return <AdminPage name={user.name} goToProfile={() => setCurrentPage("profile")} />;
      case "profile":
        return (
          <ProfilePage
            name={user.name}
            role={user.role}
            onLogout={handleLogout}
            goBack={() => setCurrentPage(user.role === "student" ? "student" : "admin")}
          />
        );
      default:
        return <h1>Page not found</h1>;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
