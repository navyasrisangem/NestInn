import "./navbar.css";
import {Link,useNavigate} from "react-router-dom";
import  {useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const API_URL = "https://nestinn.onrender.com/api";

const Navbar = () => {
const { user, dispatch } = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = async () => {
  try {
      // Send "client" userType during logout
      await axios.post(
          `${API_URL}/auth/logout`,
          { userType: "client" },  // Send user type to the backend
          { withCredentials: true }
      );

      // Remove user from localStorage
      localStorage.removeItem("user");

      // Dispatch logout action
      dispatch({ type: "LOGOUT" });

      alert("Logged out successfully!");
      navigate("/login");
  } catch (err) {
      console.error("Logout failed:", err);
  }
};

   return (
     <div className="navbar">
        <div className="navContainer">
          <Link to="/" style={{color:"inherit", textDecoration: "none"}}>
          <span className="logo">NestInn</span>
          </Link>          
          {user ? (
          <div className="navUser">
            <img
              src={user.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}  // Default avatar if no image
              alt="User Avatar"
              className="navAvatar"
            />
            <span className="navUsername">{user.username}</span>
            <button className="navButton logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : ( <div className="navItems">
            <button className="navButton" onClick={() => navigate("/register")}>Register</button>
            <button className="navButton" onClick={() => navigate("/login")}>Login</button>
          </div>)}
        </div>
     </div>
   );
};

export default Navbar;

