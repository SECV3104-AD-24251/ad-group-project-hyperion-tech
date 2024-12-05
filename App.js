
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import StudentPage from "./StudentPage";
import AdminPage from "./AdminPage";
import  "./App.css"

function App() {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      // Conditional role assignment based on email domain
      if (email.endsWith("@graduate.utm.my")) {
        setUser({ role: "student", name: result.user.displayName });
      } else if (email.endsWith("@utm.my")) {
        setUser({ role: "admin", name: result.user.displayName });
      } else {
        alert("Unauthorized email domain.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  if (user) {
    return user.role === "student" ? (
      <StudentPage name={user.name} />
    ) : (
      <AdminPage name={user.name} />
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1> Welcome to FC
      helpdesk </h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default App;
