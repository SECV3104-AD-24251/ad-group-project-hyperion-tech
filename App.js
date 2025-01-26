import React, { useState } from "react"; 
import { signInWithPopup, signOut } from "firebase/auth"; 
import { auth, googleProvider } from "./firebaseConfig"; 
import StudentPage from "./StudentPage"; 
import AdminPage from "./AdminPage"; 
import ProfilePage from "./ProfilePage"; 
import FaqEditorPage from "./FaqEditorPage"; 
import CategoryPage  from "./CateEditor"; // Import CategoryPage
import "./App.css";


function App() {
  const [user, setUser] = useState(null); 
  const [currentPage, setCurrentPage] = useState("home");
  const [categories, setCategories] = useState([]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (email.endsWith("@graduate.utm.my")) {
        setUser({ role: "student", name: result.user.displayName });
        setCurrentPage("student");
      } else if (email.endsWith("@gmail.com")) {
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
      setCurrentPage("home");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAddCategory = (categoryName) => {
    // Add category logic here (e.g., push to Firebase)
    const newCategory = { id: Date.now(), name: categoryName };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId) => {
    
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleEditCategory = (categoryId) => {
    // Edit category logic here
    const updatedCategories = categories.map((category) =>
      category.id === categoryId ? { ...category, name: "Updated Category" } : category
    );
    setCategories(updatedCategories);
  };
 
  

  const renderPage = () => {
    if (!user) {
      return (
        <div className="login-container">
          <div className="login-box">
            <h1>FC Helpdesk</h1>
            <button className="google-login-button" onClick={handleGoogleLogin}>
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
        return (
          <AdminPage
            name={user.name}
            goToProfile={() => setCurrentPage("profile")}
            goToFaqEditor={() => setCurrentPage("faqEditor")}
            goToCategoryPage={() => setCurrentPage("category")} // Navigation to Category Page
          />
        );
      case "profile":
        return (
          <ProfilePage
            name={user.name}
            role={user.role}
            onLogout={handleLogout}
            goBack={() => setCurrentPage(user.role === "student" ? "student" : "admin")}
          />
        );
      case "faqEditor":
        return (
          <FaqEditorPage
            onLogout={handleLogout}
            goBack={() => setCurrentPage("admin")}
          />
        );
      case "category":
        return (
          <CategoryPage
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
          />
        );
      default:
        return <h1>Page not found</h1>;
    }
  };

  return <div>{renderPage()}</div>;
 
}

export default App;
