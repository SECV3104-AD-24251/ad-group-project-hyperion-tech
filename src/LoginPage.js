import { useNavigate } from "react-router-dom";
import { auth,  googleProvider } from "./firebaseConfig"; // Correct import for provider
import { signInWithPopup } from "firebase/auth"; // Correct package for signInWithPopup

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Mock Role-Based Navigation
      if (user.email.includes("@graduate.utm.my")) {
        navigate("/student");
      } else if (user.email.includes("@utm.my")) {
        navigate("/admin");
      } else {
        alert("Unauthorized user");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

export default Login;