// App.js
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import StudentPage from "../src/StudentPage";
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
        <div className="login-container">
          <div className="login-box">
            <h1>FC Helpdesk</h1>
            <button className="google-login-button" onClick={handleGoogleLogin}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
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
      case "FAQ" :
        return (
        <FAQPage
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
